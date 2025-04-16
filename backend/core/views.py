from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Sum, F, FloatField
from django.db.models.functions import Cast
from datetime import datetime, timedelta
from django.utils import timezone
import json
from .models import (
    User, Skill, LearningPath, ProgressTracker, JobMatch, ResumeData, 
    GithubProfile, GithubRepository, GithubLanguage, LearningModule,
    ModuleProgress, LearningSession
)
from .serializers import (
    UserSerializer, SkillSerializer, LearningPathSerializer, 
    ProgressTrackerSerializer, JobMatchSerializer, ResumeDataSerializer,
    GithubProfileSerializer, GithubRepositorySerializer, GithubLanguageSerializer,
    LearningModuleSerializer, ModuleProgressSerializer, LearningSessionSerializer,
    ModuleProgressSummarySerializer, LearningTimeStatsSerializer
)
from .openai_service import OpenAIService
from rest_framework import status

# Create your views here.

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing users."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['email', 'first_name', 'last_name']
    
    @action(detail=False, methods=['GET'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class SkillViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing skills."""
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'category']
    
    def get_permissions(self):
        """
        Override to only allow staff users to create/update/delete skills.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()


class LearningPathViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing learning paths."""
    queryset = LearningPath.objects.all()
    serializer_class = LearningPathSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']
    
    def perform_create(self, serializer):
        """Save the creator as the current user."""
        serializer.save(creator=self.request.user)
    
    @action(detail=False, methods=['GET'])
    def my_created_paths(self, request):
        """Get learning paths created by the current user."""
        queryset = self.filter_queryset(self.get_queryset().filter(creator=request.user))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'])
    def my_enrolled_paths(self, request):
        """Get learning paths the current user is enrolled in."""
        queryset = self.filter_queryset(self.get_queryset().filter(users=request.user))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['POST'])
    def generate(self, request):
        """Generate a learning path using OpenAI API."""
        goal = request.data.get('goal')
        duration_weeks = request.data.get('duration_weeks', 4)
        
        if not goal:
            return Response(
                {"error": "Goal is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get learning path data from OpenAI
            learning_path_data = OpenAIService.generate_learning_path(goal, duration_weeks)
            
            if 'error' in learning_path_data:
                return Response(learning_path_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Create the learning path
            learning_path = LearningPath.objects.create(
                title=learning_path_data.get('title', f"{goal} Learning Path"),
                description=learning_path_data.get('description', ''),
                estimated_hours=learning_path_data.get('estimated_hours', 0),
                creator=request.user,
                is_ai_generated=True
            )
            
            # Create modules for the learning path
            modules_data = learning_path_data.get('modules', [])
            
            for module_data in modules_data:
                LearningModule.objects.create(
                    learning_path=learning_path,
                    title=module_data.get('title', ''),
                    description=module_data.get('description', ''),
                    module_type=module_data.get('type', 'article')[:20],  # Ensure it fits in the field
                    url=module_data.get('url', ''),
                    estimated_hours=module_data.get('estimated_hours', 1),
                    order=module_data.get('order', 1)
                )
            
            # Create a progress tracker for the user
            ProgressTracker.objects.create(
                user=request.user,
                learning_path=learning_path,
                progress_percentage=0.0
            )
            
            # Return the created learning path with modules
            serializer = self.get_serializer(learning_path)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {"error": f"Failed to generate learning path: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProgressTrackerViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing progress trackers."""
    serializer_class = ProgressTrackerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Only allow users to see their own progress."""
        return ProgressTracker.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Save the user as the current user."""
        serializer.save(user=self.request.user)


class JobMatchViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing job matches."""
    queryset = JobMatch.objects.all()
    serializer_class = JobMatchSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'company', 'description', 'location']
    
    @action(detail=False, methods=['GET'])
    def matching_jobs(self, request):
        """Get jobs matching the user's skills."""
        try:
            resume = request.user.resume
            user_skills = resume.skills.all()
            if not user_skills:
                return Response([])
            
            # Find jobs that require at least one of the user's skills
            skill_ids = user_skills.values_list('id', flat=True)
            jobs = JobMatch.objects.filter(skills_required__id__in=skill_ids).distinct()
            
            serializer = self.get_serializer(jobs, many=True)
            return Response(serializer.data)
        except ResumeData.DoesNotExist:
            return Response([])


class ResumeDataViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing resume data."""
    serializer_class = ResumeDataSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Only allow users to see their own resume."""
        return ResumeData.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Save the user as the current user."""
        serializer.save(user=self.request.user)


class GithubProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows GitHub profiles to be viewed.
    """
    serializer_class = GithubProfileSerializer
    queryset = GithubProfile.objects.all()
    
    def get_queryset(self):
        """
        Filter queryset to only return the GitHub profile of the authenticated user
        """
        user = self.request.user
        if user.is_authenticated:
            return GithubProfile.objects.filter(user=user)
        return GithubProfile.objects.none()
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """
        Return the GitHub profile of the authenticated user
        """
        user = request.user
        try:
            profile = GithubProfile.objects.get(user=user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except GithubProfile.DoesNotExist:
            return Response(
                {"detail": "GitHub profile not found for this user"},
                status=status.HTTP_404_NOT_FOUND
            )


class GithubRepositoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows GitHub repositories to be viewed.
    """
    serializer_class = GithubRepositorySerializer
    queryset = GithubRepository.objects.all()
    
    def get_queryset(self):
        """
        Filter queryset to only return repositories of the authenticated user's GitHub profile
        """
        user = self.request.user
        if user.is_authenticated:
            try:
                profile = GithubProfile.objects.get(user=user)
                return GithubRepository.objects.filter(github_profile=profile)
            except GithubProfile.DoesNotExist:
                return GithubRepository.objects.none()
        return GithubRepository.objects.none()


class GithubLanguageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows GitHub languages to be viewed.
    """
    serializer_class = GithubLanguageSerializer
    queryset = GithubLanguage.objects.all()
    
    def get_queryset(self):
        """
        Filter queryset to only return languages of the authenticated user's GitHub profile
        """
        user = self.request.user
        if user.is_authenticated:
            try:
                profile = GithubProfile.objects.get(user=user)
                return GithubLanguage.objects.filter(github_profile=profile)
            except GithubProfile.DoesNotExist:
                return GithubLanguage.objects.none()
        return GithubLanguage.objects.none()


class LearningModuleViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing learning modules."""
    serializer_class = LearningModuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return modules from learning paths the user is enrolled in."""
        user = self.request.user
        return LearningModule.objects.filter(
            learning_path__users=user
        ).order_by('learning_path', 'order')
    
    @action(detail=False, methods=['GET'])
    def by_path(self, request):
        """Get modules for a specific learning path."""
        path_id = request.query_params.get('path_id')
        if not path_id:
            return Response(
                {"error": "path_id query parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Verify the user is enrolled in this path
            if not ProgressTracker.objects.filter(
                user=request.user, 
                learning_path_id=path_id
            ).exists():
                return Response(
                    {"error": "You are not enrolled in this learning path"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
                
            modules = LearningModule.objects.filter(learning_path_id=path_id).order_by('order')
            serializer = self.get_serializer(modules, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ModuleProgressViewSet(viewsets.ModelViewSet):
    """ViewSet for tracking module progress."""
    serializer_class = ModuleProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Only allow users to see their own module progress."""
        return ModuleProgress.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Save the user as the current user."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['POST'])
    def mark_completed(self, request):
        """Mark a module as completed."""
        module_id = request.data.get('module_id')
        time_spent = request.data.get('time_spent_minutes', 0)
        notes = request.data.get('notes', '')
        
        if not module_id:
            return Response(
                {"error": "module_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            module = LearningModule.objects.get(id=module_id)
            
            # Check if the user is enrolled in the learning path
            if not ProgressTracker.objects.filter(
                user=request.user, 
                learning_path=module.learning_path
            ).exists():
                return Response(
                    {"error": "You are not enrolled in this learning path"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get or create module progress
            progress, created = ModuleProgress.objects.get_or_create(
                user=request.user,
                module=module,
                defaults={
                    'is_completed': True,
                    'time_spent_minutes': time_spent,
                    'completed_at': timezone.now(),
                    'notes': notes
                }
            )
            
            # Update if not created
            if not created:
                progress.is_completed = True
                progress.time_spent_minutes += time_spent
                progress.completed_at = timezone.now()
                if notes:
                    progress.notes = notes
                progress.save()
            
            # Create a learning session record
            if time_spent > 0:
                LearningSession.objects.create(
                    user=request.user,
                    module=module,
                    duration_minutes=time_spent
                )
            
            # Update overall progress on the learning path
            self._update_learning_path_progress(module.learning_path, request.user)
            
            return Response(ModuleProgressSerializer(progress).data)
        
        except LearningModule.DoesNotExist:
            return Response(
                {"error": "Module not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['GET'])
    def summary(self, request):
        """Get a summary of module progress for a learning path."""
        path_id = request.query_params.get('path_id')
        
        if not path_id:
            return Response(
                {"error": "path_id query parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Check if the user is enrolled in this path
            if not ProgressTracker.objects.filter(
                user=request.user, 
                learning_path_id=path_id
            ).exists():
                return Response(
                    {"error": "You are not enrolled in this learning path"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get total modules count
            total_modules = LearningModule.objects.filter(learning_path_id=path_id).count()
            
            # Get completed modules count
            completed_modules = ModuleProgress.objects.filter(
                user=request.user,
                module__learning_path_id=path_id,
                is_completed=True
            ).count()
            
            # Get total time spent
            total_time_spent = ModuleProgress.objects.filter(
                user=request.user,
                module__learning_path_id=path_id
            ).aggregate(total=Sum('time_spent_minutes'))['total'] or 0
            
            # Calculate completion percentage
            completion_percentage = (completed_modules / total_modules * 100) if total_modules > 0 else 0
            
            summary = {
                'total_modules': total_modules,
                'completed_modules': completed_modules,
                'total_time_spent': total_time_spent,
                'completion_percentage': completion_percentage
            }
            
            serializer = ModuleProgressSummarySerializer(summary)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['GET'])
    def time_stats(self, request):
        """Get learning time statistics by day."""
        days = int(request.query_params.get('days', 7))
        
        # Limit to reasonable range
        if days < 1:
            days = 7
        elif days > 90:
            days = 90
        
        start_date = datetime.now().date() - timedelta(days=days)
        
        try:
            # Get learning sessions grouped by date
            stats = LearningSession.objects.filter(
                user=request.user,
                date__gte=start_date
            ).values('date').annotate(
                minutes=Sum('duration_minutes'),
                module_count=Count('module', distinct=True)
            ).order_by('date')
            
            serializer = LearningTimeStatsSerializer(stats, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _update_learning_path_progress(self, learning_path, user):
        """Update the overall progress percentage for a learning path."""
        try:
            # Get total modules count
            total_modules = LearningModule.objects.filter(learning_path=learning_path).count()
            
            # Get completed modules count
            completed_modules = ModuleProgress.objects.filter(
                user=user,
                module__learning_path=learning_path,
                is_completed=True
            ).count()
            
            # Calculate completion percentage
            progress_percentage = (completed_modules / total_modules * 100) if total_modules > 0 else 0
            
            # Update progress tracker
            progress_tracker = ProgressTracker.objects.get(user=user, learning_path=learning_path)
            progress_tracker.progress_percentage = progress_percentage
            
            # Mark as completed if all modules are done
            if progress_percentage >= 100:
                progress_tracker.completed = True
                progress_tracker.completed_at = timezone.now()
                
            progress_tracker.save()
            
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Error updating learning path progress: {e}")


class LearningSessionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing learning sessions."""
    serializer_class = LearningSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Only allow users to see their own learning sessions."""
        return LearningSession.objects.filter(user=self.request.user).order_by('-date')

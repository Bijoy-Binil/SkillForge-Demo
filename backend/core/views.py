from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import User, Skill, LearningPath, ProgressTracker, JobMatch, ResumeData, GithubProfile, GithubRepository, GithubLanguage
from .serializers import (
    UserSerializer, SkillSerializer, LearningPathSerializer, 
    ProgressTrackerSerializer, JobMatchSerializer, ResumeDataSerializer,
    GithubProfileSerializer, GithubRepositorySerializer, GithubLanguageSerializer
)
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

from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers
from .models import (
    User, Skill, LearningPath, ProgressTracker, JobMatch, ResumeData, 
    GithubRepository, GithubLanguage, GithubProfile, LearningModule, 
    ModuleProgress, LearningSession, Progress
)


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the custom User model."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'bio', 'profile_image', 'date_joined', 'github_username']
        read_only_fields = ['id', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class PathSkillSerializer(serializers.ModelSerializer):
    skill_details = SkillSerializer(source='skill', read_only=True)
    
    class Meta:
        model = LearningPath
        fields = ['id', 'skill', 'skill_details', 'order', 'estimated_hours']


class LearningModuleSerializer(serializers.ModelSerializer):
    """Serializer for learning modules."""
    
    class Meta:
        model = LearningModule
        fields = ['id', 'title', 'description', 'module_type', 'url', 
                 'estimated_hours', 'order', 'created_at']


class LearningPathSerializer(serializers.ModelSerializer):
    skills = PathSkillSerializer(source='pathskill_set', many=True, read_only=True)
    creator_details = UserSerializer(source='creator', read_only=True)
    modules = LearningModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = LearningPath
        fields = ['id', 'title', 'description', 'skills', 'creator', 'creator_details', 
                  'estimated_hours', 'created_at', 'updated_at', 'is_ai_generated', 'modules']


class ProgressTrackerSerializer(serializers.ModelSerializer):
    learning_path_details = LearningPathSerializer(source='learning_path', read_only=True)
    
    class Meta:
        model = ProgressTracker
        fields = ['id', 'user', 'learning_path', 'learning_path_details', 'current_skill',
                  'progress_percentage', 'started_at', 'last_activity', 'completed', 'completed_at']


class JobMatchSerializer(serializers.ModelSerializer):
    skills_required_details = SkillSerializer(source='skills_required', many=True, read_only=True)
    
    class Meta:
        model = JobMatch
        fields = ['id', 'title', 'company', 'description', 'location', 'skills_required',
                  'skills_required_details', 'experience_level', 'salary_range', 
                  'application_url', 'posted_at', 'created_at']


class ResumeDataSerializer(serializers.ModelSerializer):
    skills_details = SkillSerializer(source='skills', many=True, read_only=True)
    
    class Meta:
        model = ResumeData
        fields = ['id', 'user', 'title', 'summary', 'experience', 'education', 
                  'skills', 'skills_details', 'certifications', 'created_at', 'updated_at']


class GithubRepositorySerializer(serializers.ModelSerializer):
    """Serializer for GitHub repositories."""
    
    class Meta:
        model = GithubRepository
        fields = ['repo_id', 'name', 'description', 'html_url', 'primary_language', 
                 'stargazers_count', 'forks_count', 'created_at', 'updated_at']


class GithubLanguageSerializer(serializers.ModelSerializer):
    """Serializer for GitHub programming languages."""
    
    class Meta:
        model = GithubLanguage
        fields = ['name', 'bytes', 'percentage', 'skill']


class GithubProfileSerializer(serializers.ModelSerializer):
    """Serializer for GitHub profiles with related languages and repositories."""
    
    languages = GithubLanguageSerializer(many=True, read_only=True)
    repositories = GithubRepositorySerializer(many=True, read_only=True)
    
    class Meta:
        model = GithubProfile
        fields = ['id', 'username', 'name', 'avatar_url', 'html_url', 'public_repos', 
                 'followers', 'following', 'bio', 'created_at', 'last_updated', 
                 'languages', 'repositories']
        read_only_fields = ['id', 'last_updated']


class GithubProfileBasicSerializer(serializers.ModelSerializer):
    """Simplified serializer for GitHub profiles without related data."""
    
    class Meta:
        model = GithubProfile
        fields = ['id', 'username', 'name', 'avatar_url', 'html_url', 'public_repos', 
                 'followers', 'following', 'last_updated']
        read_only_fields = ['id', 'last_updated']


class ModuleProgressSerializer(serializers.ModelSerializer):
    """Serializer for module progress tracking."""
    
    module_details = LearningModuleSerializer(source='module', read_only=True)
    
    class Meta:
        model = ModuleProgress
        fields = ['id', 'user', 'module', 'module_details', 'is_completed', 
                 'time_spent_minutes', 'started_at', 'completed_at', 'notes']


class LearningSessionSerializer(serializers.ModelSerializer):
    """Serializer for learning sessions."""
    
    module_details = LearningModuleSerializer(source='module', read_only=True)
    
    class Meta:
        model = LearningSession
        fields = ['id', 'user', 'module', 'module_details', 'date', 'duration_minutes', 'created_at']


class ModuleProgressSummarySerializer(serializers.Serializer):
    """Serializer for module progress summary stats."""
    
    total_modules = serializers.IntegerField()
    completed_modules = serializers.IntegerField()
    total_time_spent = serializers.IntegerField()
    completion_percentage = serializers.FloatField()


class ProgressSerializer(serializers.ModelSerializer):
    """Serializer for progress tracking."""
    module_details = LearningModuleSerializer(source='module', read_only=True)
    
    class Meta:
        model = Progress
        fields = ['id', 'user', 'module', 'module_details', 'completed', 
                 'time_spent_minutes', 'completed_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProgressStatsSerializer(serializers.Serializer):
    """Serializer for progress statistics."""
    total_modules = serializers.IntegerField()
    completed_modules = serializers.IntegerField()
    total_time_spent = serializers.IntegerField()
    completion_percentage = serializers.FloatField()


class LearningTimeStatsSerializer(serializers.Serializer):
    """Serializer for learning time statistics."""
    date = serializers.DateField()
    minutes = serializers.IntegerField()
    module_count = serializers.IntegerField()


class ResumeBuilderSerializer(serializers.Serializer):
    """Serializer for collecting data for AI resume generation."""
    user = UserSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    learning_paths = LearningPathSerializer(many=True, read_only=True)
    github_repositories = GithubRepositorySerializer(many=True, read_only=True)
    github_languages = GithubLanguageSerializer(many=True, read_only=True)
    module_progress = ModuleProgressSerializer(many=True, read_only=True)

    def to_representation(self, instance):
        """Format data for AI resume generation."""
        data = super().to_representation(instance)
        
        # Extract relevant information
        user_data = {
            'name': f"{data['user']['first_name']} {data['user']['last_name']}",
            'email': data['user']['email'],
            'bio': data['user']['bio'],
            'github_username': data['user']['github_username']
        }
        
        # Format skills
        skills_data = [{
            'name': skill['name'],
            'category': skill['category'],
            'level': skill['difficulty_level']
        } for skill in data['skills']]
        
        # Format learning paths
        learning_paths_data = [{
            'title': path['title'],
            'description': path['description'],
            'completed_modules': len([m for m in data['module_progress'] 
                                    if m['is_completed'] and m['module']['learning_path'] == path['id']]),
            'total_modules': len([m for m in data['module_progress'] 
                                if m['module']['learning_path'] == path['id']])
        } for path in data['learning_paths']]
        
        # Format GitHub projects
        projects_data = [{
            'name': repo['name'],
            'description': repo['description'],
            'primary_language': repo['primary_language'],
            'stars': repo['stargazers_count'],
            'forks': repo['forks_count']
        } for repo in data['github_repositories']]
        
        # Format programming languages
        languages_data = [{
            'name': lang['name'],
            'percentage': lang['percentage']
        } for lang in data['github_languages']]
        
        return {
            'user': user_data,
            'skills': skills_data,
            'learning_paths': learning_paths_data,
            'projects': projects_data,
            'languages': languages_data
        }


class AdminLearningModuleSerializer(serializers.ModelSerializer):
    """Admin serializer for learning modules with additional fields."""
    class Meta:
        model = LearningModule
        fields = '__all__'
        read_only_fields = ['created_at']


class AdminLearningPathSerializer(serializers.ModelSerializer):
    """Admin serializer for learning paths with additional fields."""
    modules = AdminLearningModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = LearningPath
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class AdminUserMetricsSerializer(serializers.Serializer):
    """Serializer for user metrics in admin panel."""
    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    total_learning_paths = serializers.IntegerField()
    completed_paths = serializers.IntegerField()
    average_completion_time = serializers.FloatField()
    popular_skills = serializers.ListField(child=serializers.CharField())
    user_activity = serializers.DictField()


class AdminUserSerializer(serializers.ModelSerializer):
    """Admin serializer for user management."""
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_active', 
                 'is_staff', 'date_joined', 'last_login', 'github_username']
        read_only_fields = ['id', 'date_joined', 'last_login'] 
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers
from .models import (
    User, Skill, LearningPath, ProgressTracker, JobMatch, ResumeData, 
    GithubRepository, GithubLanguage, GithubProfile, LearningModule, 
    ModuleProgress, LearningSession
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


class LearningTimeStatsSerializer(serializers.Serializer):
    """Serializer for learning time statistics by day/week."""
    
    date = serializers.DateField()
    minutes = serializers.IntegerField()
    module_count = serializers.IntegerField() 
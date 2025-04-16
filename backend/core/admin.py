from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User, Skill, LearningPath, PathSkill, ProgressTracker, JobMatch, ResumeData


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model."""
    ordering = ['email']
    list_display = ['email', 'first_name', 'last_name', 'is_staff']
    search_fields = ['email', 'first_name', 'last_name']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'bio', 'profile_image')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name'),
        }),
    )


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    """Admin configuration for Skill model."""
    list_display = ['name', 'category', 'difficulty_level']
    list_filter = ['category', 'difficulty_level']
    search_fields = ['name', 'description']


class PathSkillInline(admin.TabularInline):
    """Inline admin for PathSkill model."""
    model = PathSkill
    extra = 1


@admin.register(LearningPath)
class LearningPathAdmin(admin.ModelAdmin):
    """Admin configuration for LearningPath model."""
    list_display = ['title', 'creator', 'estimated_hours', 'created_at']
    search_fields = ['title', 'description']
    inlines = [PathSkillInline]


@admin.register(ProgressTracker)
class ProgressTrackerAdmin(admin.ModelAdmin):
    """Admin configuration for ProgressTracker model."""
    list_display = ['user', 'learning_path', 'progress_percentage', 'completed']
    list_filter = ['completed']
    search_fields = ['user__email', 'learning_path__title']


@admin.register(JobMatch)
class JobMatchAdmin(admin.ModelAdmin):
    """Admin configuration for JobMatch model."""
    list_display = ['title', 'company', 'location', 'experience_level', 'posted_at']
    list_filter = ['experience_level', 'posted_at']
    search_fields = ['title', 'company', 'description']


@admin.register(ResumeData)
class ResumeDataAdmin(admin.ModelAdmin):
    """Admin configuration for ResumeData model."""
    list_display = ['user', 'title', 'created_at', 'updated_at']
    search_fields = ['user__email', 'title', 'summary']

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, SkillViewSet, LearningPathViewSet, 
    ProgressTrackerViewSet, JobMatchViewSet, ResumeDataViewSet,
    GithubProfileViewSet, GithubRepositoryViewSet, GithubLanguageViewSet,
    LearningModuleViewSet, ModuleProgressViewSet, LearningSessionViewSet,
    ProgressViewSet, ProgressStatsView, LearningTimeStatsView, ResumeBuilderView
)

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('skills', SkillViewSet)
router.register('learning-paths', LearningPathViewSet)
router.register('progress', ProgressTrackerViewSet, basename='progress')
router.register('jobs', JobMatchViewSet)
router.register('resume', ResumeDataViewSet, basename='resume')
router.register('github/profiles', GithubProfileViewSet)
router.register('github/repositories', GithubRepositoryViewSet)
router.register('github/languages', GithubLanguageViewSet)
router.register('modules', LearningModuleViewSet, basename='modules')
router.register('module-progress', ModuleProgressViewSet, basename='module-progress')
router.register('learning-sessions', LearningSessionViewSet, basename='learning-sessions')
router.register(r'progress', ProgressViewSet, basename='progress')
router.register(r'learning-sessions', LearningSessionViewSet, basename='learning-sessions')

urlpatterns = [
    path('', include(router.urls)),
    path('progress/stats/', ProgressStatsView.as_view(), name='progress-stats'),
    path('progress/time-stats/', LearningTimeStatsView.as_view(), name='learning-time-stats'),
    path('resume/generate/', ResumeBuilderView.as_view(), name='resume-generate'),
] 
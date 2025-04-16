from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, SkillViewSet, LearningPathViewSet, 
    ProgressTrackerViewSet, JobMatchViewSet, ResumeDataViewSet,
    GithubProfileViewSet, GithubRepositoryViewSet, GithubLanguageViewSet
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

urlpatterns = [
    path('', include(router.urls)),
] 
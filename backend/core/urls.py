from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, SkillViewSet, LearningPathViewSet, 
    ProgressTrackerViewSet, JobMatchViewSet, ResumeDataViewSet,
    GithubProfileViewSet, GithubRepositoryViewSet, GithubLanguageViewSet,
    LearningModuleViewSet, ModuleProgressViewSet, LearningSessionViewSet,
    ProgressViewSet, ProgressStatsView, LearningTimeStatsView, ResumeBuilderView,
    AdminLearningPathViewSet, AdminLearningModuleViewSet, AdminUserViewSet,
    AdminMetricsView, JobViewSet, JobMatchView, JobAPIView, AdminUserListView,
    AdminLearningPathView, AdminLearningModuleView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'learning-paths', LearningPathViewSet)
router.register(r'learning-modules', LearningModuleViewSet)
router.register(r'progress', ProgressViewSet)
router.register(r'resume', ResumeDataViewSet, basename='resume')
router.register(r'github', GithubProfileViewSet, basename='github')
router.register(r'jobs', JobViewSet, basename='jobs')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
    path('admin/metrics/', AdminMetricsView.as_view(), name='admin-metrics'),
    path('admin/users/', AdminUserViewSet.as_view({'get': 'list'}), name='admin-users'),
    path('admin/learning-paths/', AdminLearningPathViewSet.as_view({'get': 'list'}), name='admin-learning-paths'),
    path('admin/learning-modules/', AdminLearningModuleViewSet.as_view({'get': 'list'}), name='admin-learning-modules'),
    path('jobs/<int:job_id>/match/', JobMatchView.as_view(), name='job-match'),
    path('admin/jobs/import/', JobAPIView.as_view(), name='job-import'),
] 
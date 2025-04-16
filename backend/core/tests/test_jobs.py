from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from ..models import Job, Skill, LearningPath, LearningModule
from ..serializers import JobSerializer

User = get_user_model()

class JobTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass'
        )
        self.regular_user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='userpass'
        )
        
        # Create test skills
        self.python_skill = Skill.objects.create(name='Python')
        self.django_skill = Skill.objects.create(name='Django')
        self.javascript_skill = Skill.objects.create(name='JavaScript')
        
        # Create test learning path
        self.learning_path = LearningPath.objects.create(
            name='Full Stack Development',
            description='Learn full stack development'
        )
        
        # Create test module
        self.learning_module = LearningModule.objects.create(
            name='Python Basics',
            description='Learn Python basics',
            learning_path=self.learning_path,
            order=1
        )
        self.learning_module.skills.add(self.python_skill)
        
        # Create test job
        self.job = Job.objects.create(
            title='Python Developer',
            company='Test Company',
            location='Remote',
            description='Looking for a Python developer',
            experience_level='mid',
            salary_range='50000-70000'
        )
        self.job.required_skills.add(self.python_skill, self.django_skill)
        
    def test_job_list(self):
        """Test retrieving list of jobs"""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get('/jobs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_job_detail(self):
        """Test retrieving job details"""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(f'/jobs/{self.job.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Python Developer')
        
    def test_job_match(self):
        """Test job matching functionality"""
        self.regular_user.skills.add(self.python_skill)
        self.client.force_authenticate(user=self.regular_user)
        
        response = self.client.get(f'/jobs/{self.job.id}/match/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('match_percentage', response.data)
        self.assertIn('matching_skills', response.data)
        self.assertIn('missing_skills', response.data)
        self.assertIn('recommended_learning_paths', response.data)
        
    def test_job_import_admin_only(self):
        """Test job import endpoint is admin-only"""
        # Try as regular user
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.post('/admin/jobs/import/', {'source': 'jsearch'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try as admin
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/admin/jobs/import/', {'source': 'jsearch'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_job_filtering(self):
        """Test job filtering functionality"""
        self.client.force_authenticate(user=self.regular_user)
        
        # Test experience level filter
        response = self.client.get('/jobs/?experience_level=mid')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test location filter
        response = self.client.get('/jobs/?location=Remote')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test min_match filter
        response = self.client.get('/jobs/?min_match=50')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) 
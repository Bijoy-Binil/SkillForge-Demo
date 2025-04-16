from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from core.models import GithubProfile, GithubRepository, GithubLanguage

class GithubAPITests(APITestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword"
        )
        self.client.force_authenticate(user=self.user)
        
        # Create GitHub profile for user
        self.github_profile = GithubProfile.objects.create(
            user=self.user,
            username="testgithub",
            name="Test User",
            bio="Test bio",
            location="Test Location",
            avatar_url="https://example.com/avatar.png",
            html_url="https://github.com/testgithub",
            public_repos=5,
            followers=10,
            following=20
        )
        
        # Create test repository
        self.repo = GithubRepository.objects.create(
            github_profile=self.github_profile,
            name="test-repo",
            description="Test repository",
            html_url="https://github.com/testgithub/test-repo",
            star_count=5,
            fork_count=2,
            is_fork=False
        )
        
        # Create test language
        self.language = GithubLanguage.objects.create(
            github_profile=self.github_profile,
            language="Python",
            percentage=75.5
        )
    
    def test_get_current_github_profile(self):
        """Test retrieving the current user's GitHub profile"""
        url = reverse('githubprofile-current')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testgithub')
        self.assertEqual(response.data['user'], self.user.id)
    
    def test_get_github_repositories(self):
        """Test retrieving GitHub repositories for the authenticated user"""
        url = reverse('githubrepository-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'test-repo')
    
    def test_get_github_languages(self):
        """Test retrieving GitHub languages for the authenticated user"""
        url = reverse('githublanguage-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['language'], 'Python')
        self.assertEqual(float(response.data[0]['percentage']), 75.5)
    
    def test_no_github_profile(self):
        """Test response when user has no GitHub profile"""
        # Create new user without GitHub profile
        user2 = User.objects.create_user(
            username="noghubuser",
            email="noghub@example.com",
            password="password123"
        )
        self.client.force_authenticate(user=user2)
        
        url = reverse('githubprofile-current')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) 
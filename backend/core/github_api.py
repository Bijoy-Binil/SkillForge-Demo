import requests
from collections import Counter

class GitHubAPI:
    """Service for interacting with GitHub API."""
    
    BASE_URL = 'https://api.github.com'
    
    @staticmethod
    def get_user_repos(username):
        """
        Get public repositories for a GitHub user.
        
        Args:
            username (str): GitHub username
            
        Returns:
            list: List of repository data
        """
        url = f"{GitHubAPI.BASE_URL}/users/{username}/repos"
        params = {'type': 'owner', 'sort': 'updated', 'per_page': 100}
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            repos = response.json()
            
            # Filter out forks and extract relevant data
            return [
                {
                    'id': repo['id'],
                    'name': repo['name'],
                    'description': repo['description'],
                    'html_url': repo['html_url'],
                    'language': repo['language'],
                    'stargazers_count': repo['stargazers_count'],
                    'forks_count': repo['forks_count'],
                    'created_at': repo['created_at'],
                    'updated_at': repo['updated_at'],
                    'fork': repo['fork']
                }
                for repo in repos if not repo['fork']
            ]
        except requests.RequestException as e:
            print(f"Error fetching GitHub repos: {e}")
            return []
    
    @staticmethod
    def get_repo_languages(username, repo_name):
        """
        Get languages used in a specific repository.
        
        Args:
            username (str): GitHub username
            repo_name (str): Repository name
            
        Returns:
            dict: Dictionary mapping language names to bytes of code
        """
        url = f"{GitHubAPI.BASE_URL}/repos/{username}/{repo_name}/languages"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching repo languages: {e}")
            return {}
    
    @staticmethod
    def get_user_languages(username):
        """
        Aggregate all languages used across a user's repositories.
        
        Args:
            username (str): GitHub username
            
        Returns:
            dict: Dictionary mapping language names to bytes of code 
        """
        repos = GitHubAPI.get_user_repos(username)
        
        # If no repos found
        if not repos:
            return {}
        
        # Aggregate languages across all repos
        all_languages = Counter()
        
        for repo in repos:
            repo_languages = GitHubAPI.get_repo_languages(username, repo['name'])
            all_languages.update(repo_languages)
        
        # Convert Counter to dictionary and sort by value (descending)
        return dict(sorted(all_languages.items(), key=lambda x: x[1], reverse=True))
    
    @staticmethod
    def get_user_profile(username):
        """
        Get a user's GitHub profile data.
        
        Args:
            username (str): GitHub username
            
        Returns:
            dict: User profile data
        """
        url = f"{GitHubAPI.BASE_URL}/users/{username}"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            user_data = response.json()
            
            # Extract relevant profile data
            return {
                'login': user_data.get('login'),
                'name': user_data.get('name'),
                'avatar_url': user_data.get('avatar_url'),
                'html_url': user_data.get('html_url'),
                'public_repos': user_data.get('public_repos'),
                'followers': user_data.get('followers'),
                'following': user_data.get('following'),
                'bio': user_data.get('bio'),
                'created_at': user_data.get('created_at'),
            }
        except requests.RequestException as e:
            print(f"Error fetching GitHub profile: {e}")
            return {}
    
    @staticmethod
    def get_contribution_data(username):
        """
        Get contribution data for a user.
        Note: This is a simplified version - GitHub's API doesn't directly
        provide detailed contribution data. For production systems,
        you might need to use the GraphQL API or scrape the contributions calendar.
        
        Args:
            username (str): GitHub username
            
        Returns:
            dict: Dictionary with contribution data
        """
        # For the simplified version, we'll return repo count and basic activity
        profile = GitHubAPI.get_user_profile(username)
        repos = GitHubAPI.get_user_repos(username)
        
        # Sort repos by update date to see recent activity
        recent_repos = sorted(repos, key=lambda x: x['updated_at'], reverse=True)[:5]
        
        return {
            'total_repos': profile.get('public_repos', 0),
            'recent_activity': [
                {
                    'name': repo['name'],
                    'updated_at': repo['updated_at'],
                }
                for repo in recent_repos
            ]
        } 
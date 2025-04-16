import openai
import json
import os
from django.conf import settings

class OpenAIService:
    """Service for interacting with OpenAI API to generate learning paths."""
    
    @staticmethod
    def generate_learning_path(goal, duration_weeks=4):
        """
        Generate a learning path using OpenAI API.
        
        Args:
            goal (str): The learning goal (e.g., "Frontend Developer")
            duration_weeks (int): Duration of the learning path in weeks
            
        Returns:
            dict: Learning path data with modules
        """
        # Get API key from settings or environment
        api_key = getattr(settings, 'OPENAI_API_KEY', os.environ.get('OPENAI_API_KEY'))
        
        if not api_key:
            raise ValueError("OpenAI API key is not configured")
        
        openai.api_key = api_key
        
        # Create prompt
        prompt = f"""
        Create a {duration_weeks}-week learning path for a {goal}.
        
        Format your response as JSON with the following structure:
        {{
            "title": "Learning Path Title",
            "description": "Brief description of this learning path",
            "estimated_hours": total estimated hours (number),
            "modules": [
                {{
                    "title": "Module title",
                    "description": "Module description",
                    "type": "video/article/exercise/quiz",
                    "url": "URL to resource",
                    "estimated_hours": estimated hours to complete (number),
                    "order": sequence number (1-based)
                }}
            ]
        }}
        
        For each module, include high-quality resources like YouTube videos, tutorials, or blog posts.
        Make sure all URLs are real and accessible.
        """
        
        try:
            # Make API call to OpenAI
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful learning path creator that generates structured learning paths for various technology skills."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2500
            )
            
            # Extract and parse JSON from response
            content = response.choices[0].message['content'].strip()
            
            # Find JSON part in the response
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = content[json_start:json_end]
                try:
                    return json.loads(json_str)
                except json.JSONDecodeError:
                    # If the JSON is invalid, return a formatted error
                    return {
                        "error": "Failed to parse JSON from OpenAI response",
                        "raw_response": content
                    }
            else:
                return {
                    "error": "No JSON found in OpenAI response",
                    "raw_response": content
                }
                
        except Exception as e:
            return {
                "error": f"OpenAI API error: {str(e)}"
            } 
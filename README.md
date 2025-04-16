# SkillForge – Personalized Learning & Career Path Platform

SkillForge is a comprehensive platform that helps users learn new skills, track their progress, and match their skills with relevant job opportunities.

## Tech Stack

### Backend
- Django
- Django REST Framework
- djoser (JWT authentication)
- PostgreSQL

### Frontend
- React
- Tailwind CSS
- Axios

### APIs
- GitHub API
- OpenAI (free tier)
- Mock job API
- YouTube Data API

## Setup Instructions

### Backend Setup

1. Create and activate a virtual environment:
   ```
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

2. Install dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. Apply migrations:
   ```
   python manage.py migrate
   ```

4. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

5. Run the development server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

## Features

- **Personalized Learning Paths**: Create and follow custom learning paths tailored to your career goals
- **Skill Tracking**: Track your progress as you acquire new skills
- **Job Matching**: Find job opportunities that match your skillset
- **Resume Builder**: Build and maintain a resume that highlights your skills and experiences
- **Community Collaboration**: Learn from and collaborate with others in the community

## Project Structure

- `backend/`: Django REST API
  - `core/`: Main app containing models, views, and serializers
  - `skillforge/`: Project settings

- `frontend/`: React application
  - `src/components/`: React components
  - `src/pages/`: Page layouts
  - `src/api/`: API service files
  - `src/context/`: React context providers 
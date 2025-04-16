# SkillForge Frontend

This is the frontend for the SkillForge learning and career path platform.

## Tech Stack

- React (with Vite)
- React Router DOM for routing
- Tailwind CSS for styling
- Axios for API requests
- Headless UI for accessible UI components
- Heroicons for icons

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `src/components/`: Reusable UI components
- `src/pages/`: Page components for different routes
- `src/layouts/`: Layout components for page structure
- `src/api/`: API service files for backend communication
- `src/context/`: React context providers for state management
- `src/hooks/`: Custom React hooks
- `src/utils/`: Utility functions and helpers

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the app for production
- `npm run preview`: Preview the production build locally

## Main Features

- User authentication (login/register)
- Dashboard with personalized learning stats
- Learning path discovery and management
- Skill tracking
- Job matching based on skills
- Resume builder

## API Integration

The frontend connects to the Django REST API backend. All API requests are made through the Axios client in `src/api/client.js`.

## Authentication

Authentication is handled using JWT (JSON Web Tokens). The `AuthContext` manages the authentication state and provides functions for login, register, and logout.

## Routing

Routes are defined in `App.jsx`. Protected routes that require authentication use the `ProtectedRoute` component.

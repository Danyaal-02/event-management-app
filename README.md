```markdown
# Event Management Application

This is a full-stack event management application that allows users to create, update, and manage events, track sessions, and integrate with an external API to fetch weather information for event locations.

## Repository Structure

- `backend/`: Contains the Node.js backend application
- `frontend/`: Contains the frontend application

## Setup

### Backend Setup

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the backend directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your_database_name
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

4. Start the backend server: `npm start`

### Frontend Setup

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the frontend directory with the following content:

```
VITE_API_URL=http://localhost:5000
```

4. Start the frontend development server: `npm run dev`

## API Routes

### Authentication

#### Register a new user
- **POST** `/api/auth/register`
- Body: `{ "email": "user@example.com", "password": "securepassword" }`

#### Login
- **POST** `/api/auth/login`
- Body: `{ "email": "user@example.com", "password": "securepassword" }`

#### Logout
- **POST** `/api/auth/logout`
- Body: `{ "sessionId": "session_id_here" }`

### Events

#### Create a new event
- **POST** `/api/events`
- Headers: `Authorization: Bearer <token>`
- Body: 
```json
{
  "name": "Team Building",
  "date": "2024-09-15T14:00:00Z",
  "location": "Central Park, New York",
  "description": "Annual team building event"
}
```

#### Get all events for the logged-in user
- **GET** `/api/events`
- Headers: `Authorization: Bearer <token>`

#### Update an event
- **PUT** `/api/events/:id`
- Headers: `Authorization: Bearer <token>`
- Body: (Same as create event, with updated fields)

#### Delete an event
- **DELETE** `/api/events/:id`
- Headers: `Authorization: Bearer <token>`

#### Get weather for an event location
- **GET** `/api/events/weather/:location`
- Headers: `Authorization: Bearer <token>`

### Sessions

#### Get all sessions for the logged-in user
- **GET** `/api/sessions`
- Headers: `Authorization: Bearer <token>`

#### Get current session
- **GET** `/api/sessions/current`
- Headers: `Authorization: Bearer <token>`

## Deployment

- Backend: Deployed on Render
- Frontend: Deployed on Netlify

## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - Supabase for authentication
  - OpenWeatherMap API for weather data
- Frontend:
  - React
  - Vite
  - TailwindCSS

## Demo Credentials

For testing purposes, you can use the following credentials to log in:

- Email: event-management-app@guerrillamail.org
- Password: qwertyui

Please note that these are shared credentials and should only be used for demonstration purposes.

## Links

- [Backend Deployment](link-to-render-deployment)
- [Frontend Deployment](link-to-netlify-deployment)
```
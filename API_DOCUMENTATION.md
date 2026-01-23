# Job Application Tracker API Documentation

## Overview
This API provides a complete system for managing job applications, including user authentication, CV management, job postings, and application tracking.

## Base URL
```
http://localhost:3001/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Authentication Endpoints

#### POST /signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "profesional_title": "Software Engineer"
}
```

**Response:**
```json
{
  "message": "Usuario registrado exitosamente",
  "results": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "profesional_title": "Software Engineer",
    "created_at": "2024-01-23T15:30:00"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### POST /login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "results": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "profesional_title": "Software Engineer",
    "created_at": "2024-01-23T15:30:00"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### GET /protected
Test endpoint to verify JWT authentication.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "message": "Autorizado para ver esta información",
  "results": "user@example.com",
  "user_id": 1
}
```

### 2. User Profile Endpoints

#### GET /users/{user_id}
Get user profile information. Users can only access their own profile.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Parameters:**
- `user_id` (integer): User ID (must match authenticated user)

**Response:**
```json
{
  "results": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "profesional_title": "Software Engineer",
    "created_at": "2024-01-23T15:30:00"
  },
  "message": "Detalles del usuario 1"
}
```

**Error Response:**
```json
{
  "message": "No autorizado para ver este perfil"
}
```

#### PUT /users/{user_id}
Update user profile information.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "name": "John Updated Doe",
  "profesional_title": "Senior Software Engineer",
  "email": "newemail@example.com"
}
```

**Response:**
```json
{
  "results": {
    "id": 1,
    "email": "newemail@example.com",
    "name": "John Updated Doe",
    "profesional_title": "Senior Software Engineer",
    "created_at": "2024-01-23T15:30:00"
  },
  "message": "Usuario 1 actualizado exitosamente"
}
```

### 3. CV Management Endpoints

#### GET /users/{user_id}/cvs
Get all CVs for a specific user.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Parameters:**
- `user_id` (integer): User ID

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "cv_url": "https://example.com/cv1.pdf",
      "created_at": "2024-01-23T15:30:00"
    }
  ],
  "message": "Listado de CVs del usuario 1"
}
```

#### POST /cv
Upload a new CV URL.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "cv_url": "https://example.com/mycv.pdf",
  "user_id": 1
}
```

**Response:**
```json
{
  "results": {
    "id": 1,
    "cv_url": "https://example.com/mycv.pdf",
    "created_at": "2024-01-23T15:30:00"
  },
  "message": "CV creado exitosamente"
}
```

#### DELETE /cv/{cv_id}
Delete a specific CV.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Parameters:**
- `cv_id` (integer): CV ID

**Response:**
```json
{
  "message": "CV 1 eliminado"
}
```

### 4. Job Management Endpoints

#### GET /jobs
Get all job listings with optional filters.

**Query Parameters:**
- `location` (string, optional): Filter by location
- `company` (string, optional): Filter by company

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "title": "Software Engineer",
      "company": "Tech Corp",
      "salary": "$80,000 - $120,000",
      "location": "San Francisco, CA",
      "created_at": "2024-01-23T15:30:00"
    }
  ],
  "message": "Listado de trabajos"
}
```

#### GET /jobs/{job_id}
Get detailed information about a specific job.

**Parameters:**
- `job_id` (integer): Job ID

**Response:**
```json
{
  "results": {
    "id": 1,
    "title": "Software Engineer",
    "company": "Tech Corp",
    "link": "https://techcorp.com/jobs/1",
    "about_job": "Join our engineering team...",
    "accountabilities": "Develop software applications...",
    "requirements": "3+ years experience...",
    "benefits": "Health insurance, 401k...",
    "salary": "$80,000 - $120,000",
    "location": "San Francisco, CA",
    "notes": "Great company culture",
    "description": "Full job description...",
    "created_at": "2024-01-23T15:30:00"
  },
  "message": "Detalles del trabajo 1"
}
```

#### POST /jobs
Create a new job posting.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "link": "https://techcorp.com/jobs/1",
  "about_job": "Join our engineering team...",
  "accountabilities": "Develop software applications...",
  "requirements": "3+ years experience...",
  "benefits": "Health insurance, 401k...",
  "salary": "$80,000 - $120,000",
  "location": "San Francisco, CA",
  "notes": "Great company culture",
  "description": "Full job description..."
}
```

**Response:**
```json
{
  "results": {
    "id": 1,
    "title": "Software Engineer",
    "company": "Tech Corp",
    "salary": "$80,000 - $120,000",
    "location": "San Francisco, CA",
    "created_at": "2024-01-23T15:30:00"
  },
  "message": "Trabajo creado exitosamente"
}
```

#### PUT /jobs/{job_id}
Update an existing job posting.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Parameters:**
- `job_id` (integer): Job ID

**Request Body:**
```json
{
  "title": "Senior Software Engineer",
  "salary": "$100,000 - $150,000"
}
```

**Response:**
```json
{
  "results": {
    "id": 1,
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "salary": "$100,000 - $150,000",
    "location": "San Francisco, CA",
    "created_at": "2024-01-23T15:30:00"
  },
  "message": "Trabajo 1 actualizado"
}
```

#### DELETE /jobs/{job_id}
Delete a job posting.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Parameters:**
- `job_id` (integer): Job ID

**Response:**
```json
{
  "message": "Trabajo 1 eliminado"
}
```

### 5. Application Tracking Endpoints

#### GET /users/{user_id}/postulations
Get all job applications for a specific user.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Parameters:**
- `user_id` (integer): User ID

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Postulación de John Doe",
      "status": "Applied",
      "interview_date": null,
      "created_at": "2024-01-23T15:30:00",
      "job": {
        "id": 1,
        "title": "Software Engineer",
        "company": "Tech Corp",
        "location": "San Francisco, CA"
      },
      "cv": {
        "id": 1,
        "cv_url": "https://example.com/mycv.pdf"
      }
    }
  ],
  "message": "Listado de postulaciones del usuario 1"
}
```

#### POST /postulations
Create a new job application.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "user_id": 1,
  "job_id": 1,
  "cv_id": 1,
  "name": "Application for Software Engineer",
  "status": "Applied"
}
```

**Response:**
```json
{
  "results": {
    "id": 1,
    "name": "Application for Software Engineer",
    "status": "Applied",
    "user_id": 1,
    "job_id": 1,
    "cv_id": 1,
    "interview_date": null
  },
  "message": "Postulación creada exitosamente"
}
```

#### GET /postulations/{postulation_id}
Get detailed information about a specific application.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Parameters:**
- `postulation_id` (integer): Application ID

**Response:**
```json
{
  "results": {
    "id": 1,
    "name": "Application for Software Engineer",
    "status": "Applied",
    "interview_date": null,
    "created_at": "2024-01-23T15:30:00",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    },
    "job": {
      "id": 1,
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "salary": "$80,000 - $120,000"
    },
    "cv": {
      "id": 1,
      "cv_url": "https://example.com/mycv.pdf"
    }
  },
  "message": "Detalles de la postulación 1"
}
```

#### PATCH /postulations/{postulation_id}/status
Update application status or interview date.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Parameters:**
- `postulation_id` (integer): Application ID

**Request Body:**
```json
{
  "status": "Interviewing",
  "interview_date": "2024-01-30T14:00:00Z"
}
```

**Response:**
```json
{
  "results": {
    "id": 1,
    "name": "Application for Software Engineer",
    "status": "Interviewing",
    "user_id": 1,
    "job_id": 1,
    "cv_id": 1,
    "interview_date": "2024-01-30T14:00:00"
  },
  "message": "Postulación 1 actualizada"
}
```

#### DELETE /postulations/{postulation_id}
Delete a job application.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Parameters:**
- `postulation_id` (integer): Application ID

**Response:**
```json
{
  "message": "Postulación 1 eliminada"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Database Configuration
DATABASE_URL=sqlite:///jobtracker.db

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# Flask Configuration
FLASK_APP=src/app.py
FLASK_DEBUG=1
FLASK_ENV=development

# API Configuration
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

## Testing the API

You can test the API using curl, Postman, or any HTTP client. Here's an example using curl:

```bash
# Register a new user
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "name": "Test User"}'

# Login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Get user profile (replace TOKEN with actual JWT token)
curl -X GET http://localhost:3001/api/users/1 \
  -H "Authorization: Bearer TOKEN"
```

## Security Notes

1. **JWT Secret Key**: Always use a strong, unique secret key in production
2. **HTTPS**: Use HTTPS in production to protect sensitive data
3. **Input Validation**: All inputs are validated on the server side
4. **Authorization**: Users can only access their own data
5. **Password Hashing**: Passwords are hashed using Werkzeug's security functions

## Rate Limiting

Consider implementing rate limiting for production use to prevent abuse of the authentication endpoints.
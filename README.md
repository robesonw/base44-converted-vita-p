# Quickstart
1. Clone the repository.
2. Run `docker-compose up --build` to start the application.

# Environment Variables
| Variable                 | Description                       |
|--------------------------|-----------------------------------|
| DATABASE_URL             | PostgreSQL connection string      |
| JWT_SECRET               | Secret for signing JWTs           |
| JWT_REFRESH_SECRET       | Secret for signing refresh tokens  |
| PORT                     | Port for the backend server       |
| CORS_ORIGIN              | Origin to allow for CORS         |
| AI_PROVIDER              | AI Provider (e.g. openai)        |
| AI_MODEL                 | AI Model to use                  |
| AI_API_KEY              | API Key for AI                   |

# API Reference
## Auth Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/refresh`

## Upload Route
- `POST /api/upload`

## AI Route
- `POST /api/ai/invoke`
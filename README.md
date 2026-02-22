# Application API

## Quickstart
1. Clone the repository.
2. Copy `.env.example` to `.env` and fill in the required details.
3. Run `docker-compose up` to start the services.

## Environment Variables
| Variable                   | Description                                 |
|----------------------------|---------------------------------------------|
| DATABASE_URL               | PostgreSQL connection string                |
| JWT_SECRET                 | Secret for signing JWT                      |
| JWT_REFRESH_SECRET         | Secret for signing refresh tokens           |
| JWT_EXPIRES_IN             | Access token expiration time (default: 15m)|
| REFRESH_EXPIRES_IN         | Refresh token expiration time (default: 7d)|
| PORT                       | Port for the backend server (default: 4000)|
| CORS_ORIGIN                | Allowed origin for CORS                     |
| UPLOAD_DIR                 | Directory for file uploads                   |
| AI_PROVIDER                | AI service provider (default: openai)       |
| AI_MODEL                   | AI model to use (default: gpt-4o-mini)     |
| AI_API_KEY                | API key for AI service                       |

## API Reference
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Login and receive tokens.
- `GET /api/auth/me` - Get the current user's information.
- `POST /api/auth/refresh` - Refresh access token.
- `POST /api/auth/logout` - Logout the user.
- `POST /api/upload` - Upload a file.
- `GET /api/files/:filename` - Retrieve uploaded file.
- `POST /api/ai/invoke` - Invoke AI model with a prompt.
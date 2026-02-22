# Quick Start

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your credentials.

4. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```

## Environment Variables
| Variable                     | Description                             |
|------------------------------|-----------------------------------------|
| DATABASE_URL                 | Your PostgreSQL connection string       |
| JWT_SECRET                   | Secret for JWT access tokens            |
| JWT_REFRESH_SECRET           | Secret for JWT refresh tokens           |
| JWT_EXPIRES_IN               | Expiration time of access tokens       |
| REFRESH_EXPIRES_IN          | Expiration time of refresh tokens       |
| PORT                         | Port for the backend application        |
| CORS_ORIGIN                  | Allowed CORS origin                     |
| UPLOAD_DIR                   | Directory for file uploads              |
| AWS_S3_BUCKET                | Your AWS S3 bucket name                 |
| AWS_REGION                   | Your AWS S3 bucket region                |
| AWS_ACCESS_KEY_ID           | Your AWS access key                     |
| AWS_SECRET_ACCESS_KEY       | Your AWS secret access key              |
| AI_PROVIDER                  | AI service provider (openai etc.)      |
| AI_MODEL                     | AI model to use                        |
| AI_API_KEY                  | API key for AI service                  |

## API Reference
- **Auth Routes**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`

- **AI Routes**
  - `POST /api/ai/invoke`

- **File Upload Routes**
  - `POST /api/upload`
  - `GET /api/files/:filename`
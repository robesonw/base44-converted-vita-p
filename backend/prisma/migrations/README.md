# Migration Steps

This file guides you through the steps to set up your Prisma migrations.

## Steps to Run Migrations
1. Install the required dependencies:
   ```bash
   npm install
   ```

2. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```

3. Run the migration to set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Seed the database (optional):
   ```bash
   npx prisma db seed
   ```

Make sure your .env file contains the DATABASE_URL to connect with your PostgreSQL database.
# Database Migration Steps

Follow these instructions to set up your database:

1. Install the necessary packages:
   ```bash
   npm install
   ```
2. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```
3. Create and apply migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed the database:
   ```bash
   npx prisma db seed
   ```
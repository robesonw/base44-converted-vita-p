# Database Migration Steps

1. Install required packages:
   ```bash
   npm install
   ```
2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
3. Create migration:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed the database:
   ```bash
   npx prisma db seed
   ```
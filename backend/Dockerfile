# Use Node.js 20 Alpine image for a lightweight container
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source files
COPY ./src ./src

# Build the project
RUN npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package.json .
RUN npm install --only=production

# Migrate DB
RUN npm run db:migrate

# Start the app
CMD ["node", "dist/index.js"]
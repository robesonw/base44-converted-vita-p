# Use Node.js 20 runtime
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./
COPY --from=builder /app/package*.json ./
RUN npm install --production
CMD [ "node", "index.js" ]
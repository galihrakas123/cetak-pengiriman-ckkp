# Stage 1: Build
FROM node:18.17.0 AS builder
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Use --legacy-peer-deps to handle peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy built assets to Nginx's default public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy your custom Nginx configuration
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

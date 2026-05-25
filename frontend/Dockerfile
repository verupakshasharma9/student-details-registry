# Stage 1: Build React/Vite application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package configuration files
COPY package.json package-lock.json* ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application (generates the build outputs in 'dist/')
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy built assets from the builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Overwrite default Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to mapping configurations
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

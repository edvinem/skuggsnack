# Stage 1: Build React app
FROM node:16-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source files and build
COPY . ./

# Verify source files are copied
RUN ls -l /app/src/components

# Run the build process
RUN npm run build

# Verify that the build folder has been created with necessary files
RUN ls -R /app/build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built React app from Stage 1
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

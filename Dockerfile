# Use Nginx base image
FROM nginx:alpine
# Copy custom nginx config
COPY ./public /usr/share/nginx/html/


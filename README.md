# Currency-Converter_App# Currency Converter App Deployment

## Overview

This project demonstrates deploying a static currency converter web application using Docker, Docker Compose, and HAProxy as a load balancer. The app is served by two Nginx-based web servers (`web-01` and `web-02`), with HAProxy (`lb-01`) distributing traffic between them for load balancing and high availability.

## Deployment Steps

### 1. Build and Push the Docker Image

Build the Docker image from the project root to containerize the application:

```sh
docker build -t yourdockerhubusername/currency-app:v1 .
```

Log in to Docker Hub and push the image:

```sh
docker login
docker push yourdockerhubusername/currency-app:v1
```

Containerizing the app ensures consistency across environments and simplifies deployment.

### 2. Configure Docker Compose

Navigate to the `web_infra_lab` directory and review the [`compose.yml`](web_infra_lab/compose.yml) file, which defines three services:

- **web-01**: Nginx server at `172.20.0.11`, ports `2211:22` (SSH), `8080:80` (HTTP)
- **web-02**: Nginx server at `172.20.0.12`, ports `2212:22` (SSH), `8081:80` (HTTP)
- **lb-01**: HAProxy load balancer at `172.20.0.10`, ports `2210:22` (SSH), `8082:80` (HTTP)

Start all services:

```sh
docker compose up -d --build
```

Docker Compose orchestrates the multi-container setup, making management easy.

### 3. SSH into the Load Balancer and Configure HAProxy

SSH into the load balancer:

```sh
ssh ubuntu@localhost -p 2210
```

Install HAProxy:

```sh
sudo apt update && sudo apt install -y haproxy
```

Edit `/etc/haproxy/haproxy.cfg` to define load balancing rules. Example configuration:

```
global
    daemon
    maxconn 256

defaults
    mode http
    timeout connect 5s
    timeout client 50s
    timeout server 50s

frontend http-in
    bind *:80
    default_backend servers

backend servers
    balance roundrobin
    server web01 172.20.0.11:80 check
    server web02 172.20.0.12:80 check
    http-response set-header X-Served-By %[srv_name]
```

Restart HAProxy:

```sh
sudo service haproxy restart
```

This setup enables efficient traffic distribution between the web servers.

## Testing the Deployment

### 1. Access the Application via Load Balancer

From your host machine, access the app through the load balancer:

```sh
curl http://localhost:8082
```

You should see the HTML content of your app.

### 2. Verify Load Balancing

Run the following multiple times:

```sh
curl -I http://localhost:8082
```

Check the `X-Served-By` header; it should alternate between `web01` and `web02`, confirming load balancing.

## Notes & Troubleshooting

- If you get a port allocation error (e.g., `Bind for 0.0.0.0:8080 failed`), ensure no other process is using the port or stop previous containers.
- Make sure your Docker image is pushed to Docker Hub and accessible.
- To SSH into the web servers for debugging:

  ```sh
  ssh ubuntu@localhost -p 2211  # web-01
  ssh ubuntu@localhost -p 2212  # web-02
  ```

## Summary

- **Docker**: Containerizes and serves the static app with Nginx.
- **Docker Compose**: Orchestrates the multi-container setup.
- **HAProxy**: Load balances requests between two web servers.
- **Testing**: Confirms both servers serve traffic via the load balancer.

Screenshots can be added to the project directory to demonstrate the setup and

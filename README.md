#Currency Converter App Deployment

## Overview

This project demonstrates deploying a static currency converter web application using Docker, Docker Compose, and HAProxy as a load balancer. The app, which allows users to convert between different currencies using live exchange rates fetched from an external API, is served by two Nginx-based web servers (web-01 and web-02). HAProxy (lb-01) is used to distribute traffic between these servers, ensuring load balancing and high availability.
The Currency Converter web application enables users to select currencies, input an amount, and receive the converted amount instantly. It also includes features for searching and sorting currencies, as well as dynamically updating the list of available currencies. This setup ensures that the application is robust, scalable, and capable of handling user requests efficiently.

## Features
Currency Conversion: Convert between different currencies using live exchange rate data.
Currency Search: Search for currencies by name or code.
Currency Sorting: Sort the list of available currencies alphabetically.
Responsive Design: The app is designed to be mobile-friendly and looks good on all screen sizes.
User-Friendly Interface: Simple and intuitive interface with clear instructions for use.

## Technologies Used

HTML: Structure of the web application.
CSS: Styling and layout.
JavaScript: Handles functionality such as fetching data from the API, performing currency conversion, and updating the UI.
API: ExchangeRate API (used for live currency rates).

## Deployment Steps

##Image Details

. Docker Hub Repository URL: placide625/currency-app
. Image Name: placide625/currency-app
. Tag:v1


### 1. Build and Push the Docker Image

Build the Docker image from the project root to containerize the application:

```sh
docker build -t placide625/currency-app:v1 .
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

Demo Video Watch the demo video that showcases the application running locally and on the deployed servers with the load balancer:https://youtu.be/WnorX65ptY8?si=XhyFOWzakJpBzyNA 


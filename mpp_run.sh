#!/bin/bash
liveServer() {
    set_env_live
    echo "Delete existing container if present..."

    docker ps -a | grep mpp_admin | awk '{print $1}' | xargs docker stop
    docker ps -a | grep mpp_admin | awk '{print $1}' | xargs docker rm

    echo "Built MPP ADMIN image..."
    docker build -t mpp_admin:latest .

    echo "Starting MPP ADMIN..."
    docker run -d -p 3000:3002 mpp_admin:latest
}

liveServer
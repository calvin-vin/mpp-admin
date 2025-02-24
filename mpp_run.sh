liveServer() {
    set_env_live

    echo "Built MPP ADMIN image..."
    docker build -t mpp_admin:latest .

    echo "Starting MPP ADMIN...."
    docker run -d --network app_skpnetwork -p 8080:3000 --name mpp_admin_container mpp_admin:latest
}

liveServer
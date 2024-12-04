# SkuggSnack

Skuggsnack is a simple (but vulnerable) web-based chat application. It provides a user-friendly interface where users can register, log in, and add friends. The application follows a microservices architecture with separate services for frontend, authentication and chat. 

## Main Technologies
- Frontend: React.js
- Backend: FastAPI
- Database: MongoDB
- Containerization: Docker
- Orchestration: Kubernetes (Minikube)
- Backend Reverse Proxy: Nginx

## (Personal) Deployment Steps
1. **Clone the Repository**

    ```bash
    git clone https://github.com/edvinem/skuggsnack.git
    cd skuggsnack
    ```
2. **Run Minikube Deployment Script**

    ```bash
    chmod +x build_start_pods.sh
    ./build_start_pods.sh
    ```

## Prerequisites
- Docker
- Kubernetes (Minikube)
- kubectl

## Usage
1. Register a new user
2. Log in with your credentials
3. Add friends and start chattin'!

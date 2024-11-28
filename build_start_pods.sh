#!/bin/bash

set -e

DOCKER_USERNAME="edvinem" 
NAMESPACE="skuggsnack"
AUTH_IMAGE="${DOCKER_USERNAME}/auth-service:latest"
CHAT_IMAGE="${DOCKER_USERNAME}/chat-service:latest"
FRONTEND_IMAGE="${DOCKER_USERNAME}/frontend:latest"

echo "🚀 Starting Minikube with Docker driver..."
minikube start --driver=docker

echo "🔒 Checking Docker Hub authentication..."
if ! docker info | grep -q 'Username:'; then
    echo "⚠️ You need to be logged in to Docker Hub. Please run 'docker login' and try again."
    exit 1
fi
echo "✅ Docker Hub authentication verified."

echo "🌐 Creating Kubernetes namespace '${NAMESPACE}'..."
kubectl apply -f kubernetes/namespace.yaml -n skuggsnack

echo "🔑 Applying Kubernetes secrets..."
kubectl apply -f kubernetes/auth-secrets.yaml -n skuggsnack

echo "📄 Applying Kubernetes deployment manifests..."
kubectl apply -f kubernetes/auth-deployment.yaml -n skuggsnack
kubectl apply -f kubernetes/chat-deployment.yaml -n skuggsnack
kubectl apply -f kubernetes/frontend-deployment.yaml -n skuggsnack

deploy_service() {
    SERVICE_DIR=$1
    IMAGE=$2
    DEPLOYMENT_NAME=$3

    echo "📦 Rebuilding and pushing Docker image for ${SERVICE_DIR}..."
    cd ${SERVICE_DIR}

    echo "🔨 Building Docker image: ${IMAGE}..."
    docker build -t ${IMAGE} .

    echo "📤 Pushing Docker image ${IMAGE} to Docker Hub..."
    docker push ${IMAGE}

    echo "🔄 Updating Kubernetes deployment '${DEPLOYMENT_NAME}' with image ${IMAGE}..."
    kubectl set image deployment/${DEPLOYMENT_NAME} ${DEPLOYMENT_NAME}=${IMAGE} -n ${NAMESPACE}

    cd ..
}

deploy_service "auth-service" "${AUTH_IMAGE}" "auth-service"
deploy_service "chat-service" "${CHAT_IMAGE}" "chat-service"
deploy_service "frontend" "${FRONTEND_IMAGE}" "frontend"

echo "📄 Applying remaining Kubernetes manifests..."
kubectl apply -f kubernetes/mongodb-deployment.yaml -n skuggsnack
kubectl apply -f kubernetes/mongodb-pvc.yaml -n skuggsnack
kubectl apply -f kubernetes/mongodb-service.yaml -n skuggsnack
kubectl apply -f kubernetes/frontend-service.yaml -n skuggsnack
kubectl apply -f kubernetes/chat-service.yaml -n skuggsnack
kubectl apply -f kubernetes/auth-service.yaml -n skuggsnack
kubectl apply -f kubernetes/ingress.yaml -n skuggsnack

echo "🔍 Verifying Kubernetes deployments..."
kubectl rollout status deployment/auth-service -n ${NAMESPACE}
kubectl rollout status deployment/chat-service -n ${NAMESPACE}
kubectl rollout status deployment/frontend -n ${NAMESPACE}
kubectl rollout status deployment/mongodb -n ${NAMESPACE}

echo "🛠️ Enabling Ingress addon in Minikube..."
minikube addons enable ingress

INGRESS_IP=$(minikube ip)
SERVER_IP=$(ip route get 1 | awk '{print $7; exit}')

echo "🎉 Deployment completed successfully!"
echo "🙂 You can access the application at http://${INGRESS_IP}:31080/"
echo "🤔 If not? Portwarding might help!"
read -p "❓ Do you want to port-forward the frontend service? (yes/no): " choice
case "$choice" in
    yes|y|Y )
        echo "🚀 Starting port-forwarding for the frontend service..."
        kubectl port-forward -n ${NAMESPACE} --address 0.0.0.0 service/frontend 31080:80 &
        echo "✅ Port-forwarding initiated. Access the frontend at: http://${SERVER_IP}:31080"
        ;;
    no|n|N )
        echo "ℹ️ Skipping port-forwarding."
        ;;
    * )
        echo "⚠️ Invalid input. Skipping port-forwarding."
        ;;
esac

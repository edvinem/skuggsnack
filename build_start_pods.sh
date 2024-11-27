#!/bin/bash

cd ~/workspace/skuggsnack

# Rebuild, push, and redeploy Auth Service
cd auth-service
docker build -t playground/auth-service:latest .
docker push playground/auth-service:latest
kubectl set image deployment/auth-service auth-service=playground/auth-service:latest -n skuggsnack
cd ..

# Rebuild, push, and redeploy Chat Service
cd chat-service
docker build -t playground/chat-service:latest .
docker push playground/chat-service:latest
kubectl set image deployment/chat-service chat-service=playground/chat-service:latest -n skuggsnack
cd ..

# Rebuild, push, and redeploy Frontend Service
cd frontend
docker build -t playground/frontend:latest .
docker push playground/frontend:latest
kubectl set image deployment/frontend frontend=playground/frontend:latest -n skuggsnack
cd ..

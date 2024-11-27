# Skuggsnack Design

Skuggsnack is a simple web-based chat application that allows users to communicate in real-time. It provides a user-friendly interface where users can register, log in, and add friends. The name was chosen as the application would incorporate a tor gateway for traffic to ensure privacy. This was however not implemented. 

The application uses Minikube for kubernetes deployment.


## Frontend Service

* Role: Provides the user interface for the application.
* Responsibilities:
    * Serves the React-based web application to users.
    * Communicates with the Auth and Chat services via RESTful APIs.
    * Handles user interactions and renders chat messages.

## Auth Service

* Role: Manages user authentication and authorization.
* Responsibilities:
    * Handles user registration and login processes.
    * Generates and validates JWT tokens for secure communication.
* Stores user credentials and information securely in MongoDB.


## Chat Service

* Role: Manages real-time chat functionality.
* Responsibilities:
    * Facilitates sending and receiving messages between users.
    *  Ensures messages are stored and retrieved efficiently.
    * Interacts with MongoDB to persist chat history.

## MongoDB Database

* Role: Serves as the primary data store for the application.
* Responsibilities:
    * Stores user data, authentication credentials, and chat messages.
    * Provides data persistence across service restarts and scaling.
    * Architecture Principles and Cloud Patterns
    * Microservices Architecture:



Kubernetes manages the deployment, scaling, and networking of containers.
Utilizes Kubernetes resources such as Deployments, Services, and ConfigMaps.
NodePort Service Exposure:

The frontend service is exposed externally using a Kubernetes NodePort, allowing external access to the application.
Reverse Proxy with Traefik:

Traefik acts as a reverse proxy, routing external requests to the NodePort service.
Simplifies domain management and handles routing based on hostnames.
Mapping Between Components and Microservices
Frontend Service:

Microservice: frontend
Deployment: frontend-deployment.yaml
Service: Exposed via a NodePort service (frontend-service.yaml)
Auth Service:

Microservice: auth-service
Deployment: auth-deployment.yaml
Service: ClusterIP service for internal communication
Chat Service:

Microservice: chat-service
Deployment: chat-deployment.yaml
Service: ClusterIP service for internal communication
MongoDB:

Microservice: mongodb
Deployment: mongodb-deployment.yaml
Service: ClusterIP service
Persistent Volume Claim: mongodb-pvc.yaml for data persistence

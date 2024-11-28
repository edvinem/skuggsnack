# Skuggsnack Design

Skuggsnack is a simple web-based chat application that allows users to communicate in real-time. It provides a user-friendly interface where users can register, log in, and add friends. The name was chosen as the application would incorporate a tor gateway for traffic to ensure privacy. This was however not implemented. 

The application uses Minikube for kubernetes deployment.

## Auth Service

* Role: Manages user authentication and authorization.
* Responsibilities:
    * Handles user registration and login processes.
    * Generates and validates JWT tokens for secure communication.
* Stores user credentials and information securely in MongoDB.

## Auth Service External API Endpoints

### User Registration
* Endpoint: /auth/register
* Method: POST
* Description: Registers a new user with the provided username and password.

#### Request JSON:
```json
{
  "username": "string",
  "password": "string"
}
```
#### Response JSON (201 Created):
```json
{
  "message": "User registered successfully"
}
```
#### Response JSON Failure (400 Bad Request):
```json
{
  "detail": "Username already exists"
}
```
### User Login
* Endpoint: /auth/login
* Method: POST
* Description: Authenticates the user and provides a JWT token for authorized access.

#### Request JSON:
```json
{
  "username": "string",
  "password": "string"
}
```
#### Response JSON (200 OK):
```json
{
  "access_token": "jwt_token_string",
  "token_type": "bearer"
}
```
#### Response JSON Failure (400 Bad Request):
```json
{
  "detail": "Invalid credentials"
}
```
### Add Friend
* Endpoint: /auth/add_friend
* Method: POST
* Description: Adds the specified user as a friend to the authenticated user's friend list.
* Header: ```Authorization: Bearer <JWT_TOKEN>```
#### Request JSON:
```json
{
  "friend_username": "string"
}
```
#### Response JSON (200 OK):
```json
{
  "message": "Friend added successfully."
}
```
#### Response JSON Failure (400 Bad Request):
```json
{
  "detail": "Cannot add yourself as a friend."
}
```
### Send Friend Request
* Endpoint: /auth/add_friend
* Method: POST
* Description: Sends a friend request to the specified user.

* Header: ```Authorization: Bearer <JWT_TOKEN>```
#### Request JSON:
```json
{
  "friend_username": "string"
}
```
#### Response JSON (200 OK):
```json
{
  "message": "Friend request sent."
}
```
#### Response JSON Failure (400 Bad Request):
```json
{
  "detail": "You are already friends with this user."
}
```
### Accept Friend Request
* Endpoint: /auth/accept_friend_request
* Method: POST
* Description: Accepts a pending friend request from the specified user, adding them to the authenticated user's friend list.
* Header: ```Authorization: Bearer <JWT_TOKEN>```
#### Request JSON:
```json
{
  "requesting_username": "string"
}
```
#### Response JSON (200 OK):
```json
{
  "message": "Friend request accepted."
}
```
#### Response JSON Failure (400 Bad Request):
```json
{
  "detail": "No friend request from this user."
}
```
### Get Current User
* Endpoint: /auth/me
* Method: GET
* Description: Fetches the authenticated user details, including their friends list.
* Header: ```Authorization: Bearer <JWT_TOKEN>```
#### Response JSON (200 OK):
```json
{
  "username": "string",
  "friends": ["string", "string", ...]
}
```
#### Response JSON Failure (401 Unauthorized):
```json
{
  "detail": "Invalid token"
}
```
## Chat Service

* Role: Manages real-time chat functionality.
* Responsibilities:
    * Facilitates sending and receiving messages between users.
    *  Ensures messages are stored and retrieved efficiently.
    * Interacts with MongoDB to persist chat history.

## Chat Service External API Endpoints

### Get Messages
* Endpoint: /chat/get_messages/{recipient}
* Method: GET
* Description: Fetches the conversation history between the authenticated user and the specified recipient.
* Parameter: ```recipient: string```
* Header: ```Authorization: Bearer <JWT_TOKEN>```
#### Response JSON (200 OK):
```json
[
  {
    "sender": "string",
    "recipient": "string",
    "content": "string",
    "recipient_type": "string",
    "timestamp": "2024-11-27T14:56:06Z"
  },
  ...
]
```
#### Response JSON Failure (401 Unauthorized):
```json
{
  "detail": "Invalid token"
}
```

## Frontend Service

* Role: Provides the user interface for the application.
* Responsibilities:
    * Serves the React-based web application to users.
    * Communicates with the Auth and Chat services via RESTful APIs.
    * Handles user interactions and renders chat messages.


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

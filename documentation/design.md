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
### Get Friends
* Endpoint: /auth/friends
* Method: GET
* Description: Fetches the list of friends associated with the authenticated user.
* Header: ```Authorization: Bearer <JWT_TOKEN>```
#### Response JSON (200 OK):
```json
["friend1", "friend2", "friend3", ...]
```
#### Response JSON Failure (404 Not Found):
```json
{
  "detail": "User not found."
}
```
### Send Friend Request
* Endpoint: /auth/send_friend_request
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


## Chat Service

* Role: Manages real-time chat functionality.
* Responsibilities:
    *  Responsible for sending and receiving messages between users.
    *  Ensures messages are stored and retrieved efficiently.
    *  Interacts with MongoDB to persist chat history.

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
### Send Message
* Endpoint: /chat/send_message
* Method: POST
* Description: Sends a message to the specified recipient.
* Header: ```Authorization: Bearer <JWT_TOKEN>```
#### Request JSON:
```json
{
  "recipient": "string",
  "content": "string", # Message
  "recipient_type": "user"
}
```
#### Response JSON (201 Created):
```json
{
  "sender": "string",
  "recipient": "string",
  "content": "string",
  "recipient_type": "string",
  "timestamp": "2024-11-27T14:56:06Z"
}
```
#### Failure (500 Internal Server Error):
```json
{
  "detail": "Internal Server Error"
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

# Architecture Principles and Cloud Patterns

* Microservices Architecture
  - Services (Frontend, Auth, Chat) are developed, deployed, and scaled independently.
  - Promotes separation of concerns for easier maintenance and updates.

* Containerization
  - Services are containerized using Docker, ensuring consistency across development, testing, and production environments.

* Orchestration with Kubernetes
  - Manages deployment, scaling, and networking of containers.
  - Utilizes resources like Deployments, Services, and ConfigMaps for efficient management.

* Service Discovery and Networking
  - Services communicate using Kubernetes' internal DNS and ClusterIP services.
  - Frontend is exposed externally via NodePort, allowing user access through a browser.

* Reverse Proxy with Traefik
  - Traefik routes external requests to the appropriate NodePort service.
  - Simplifies domain management and handles hostname-based routing.


# Mapping Between Components and Microservices

| Component        | Microservice   | Deployment File           | Service Type | Replicas | Dependencies                     |
|------------------|----------------|---------------------------|--------------|----------|----------------------------------|
| Frontend Service | frontend       | frontend-deployment.yaml  | ClusterIP    | 3        | Auth Service, Chat Service, MongoDB |
| Auth Service     | auth-service   | auth-deployment.yaml      | ClusterIP    | 2        | MongoDB                          |
| Chat Service     | chat-service   | chat-deployment.yaml      | ClusterIP    | 2        | Auth Service, MongoDB            |
| MongoDB Database | mongodb        | mongodb-deployment.yaml   | ClusterIP    | 1        | -                                |

**Frontend Service as NodePort:**
The frontend needs to be accessible externally by users via a web browser. By using the `NodePort` service type, Kubernetes exposes the frontend service on a specific port of each node in the cluster. This allows users to access the application through `http://<NodeIP>:<NodePort>`. But in my kubernetes environment, using the NodePort service type did not not expose the service externally as expected. This is why I instead used port-forwarding kubectl port-forward is used to map the service port to your local machine, allowing you to access the application through http://localhost:<Port>.

so update this accordingly:
**Frontend Service as NodePort:**
The frontend needs to be accessible externally by users via a web browser. By using the `NodePort` service type, Kubernetes exposes the frontend service on a specific port of each node in the cluster. This allows users to access the application through `http://<NodeIP>:<NodePort>`.

and explain why this is more thorogly, use illustrations or explain why this is. my server hosting kubernetes, me trying to access nodeIP from windows machine (remote sshing to server to code). Using nodeport could access so had to use port forwarding
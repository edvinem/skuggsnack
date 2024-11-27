# Benefits and Challenges of Design
## Benefits
### Scalability
* Microservices can be scaled independently based on load.
Kubernetes automates scaling through Deployments and ReplicaSets.
### Maintainability
* Docker provides consistent environments, making it easier to develop, test, and deploy services.
* Separation of concerns allows teams to work on services independently, however uninteresting since I develop alone
* Easier to update or replace individual components without affecting others.
### Resilience
* Kubernetes ensures high availability by automatically restarting failed containers and rescheduling them on healthy nodes.
* Services are isolated in their own containers, reducing the impact of failures on the overall system.
* Kubernetes health checks monitor the status of services and maintain system stability.
### Flexibility
* Containerization with Docker allows for consistent deployment environments across development, staging, and production.
* Kubernetes orchestration provides flexibility in deploying services on different nodes and environments.

## Challenges
### Complexity
* Managing multiple services increases operational complexity.
* Kubernetes orchestration requires knowledge of various resources like Deployments, Services, ConfigMaps, and Secrets.
* Monitoring and logging across microservices necessitate robust tooling.

### Networking
* Service discovery and communication between services need to be managed within the Kubernetes cluster.
* Exposing services externally requires careful configuration of
NodePort services and integration with Traefik.
* Networking policies must be defined to secure inter-service communication.


### Security
* Multiple services increase the attack surface, requiring secure practices.
* Managing sensitive data using Kubernetes Secrets is crucial to prevent exposure.
* Implementing JWT authentication ensures secure communication but requires proper key management.
* MongoDB needs to be secured to protect data at rest and during transit.
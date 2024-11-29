# Benefits and Challenges for Skuggsnack

## Benefits

### Scalability
* Microservices can be scaled independently based on load.
* Kubernetes will automate scaling via deployments and replicas.

### Maintainability
* Docker provides consistent environments for each microservice, which are also seperated for easier maintenance and updates.
* This means that development and deployment is consistent regardless of host OS, CPU architecture etc. 

### Resilience
* Kubernetes ensures high availability for containers by automatically restarting failed containers and restarting them on healthy nodes.
* The microservices are isolated in their own containers, this reduces the impact of failures on the host system.
* Kubernetes health checks monitor the status of servics automatically.

## Challenges

### Complexity
* Managing multiple may increase complexity, as the number of microservices increases.
* Kubernetes deployment can be complex and usually require a good amount of knowledge.

### Networking
* Service discovery and communication between microservices in the kubernetes cluster can also be complex, resulting in failing connections.
* Networking policies must be secure if the application is exposed to the public, which may also require a high amount of knowledge.

### Security
* Multiple services and their technologies and libraries, increase the attack surface.
* Managing sensitive data correctly using kubernetes screts is crucial to prevent leaks.
* Implementing JWT authentication ensures secure communication but also requires proper key management.
* MongoDB needs to be properly secured to protect data at rest and during transit.

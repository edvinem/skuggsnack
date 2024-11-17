# SkuggSnack

## Plan
├── authentication_service/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── auth_app.py  # The main FastAPI application for user authentication
│   └── kubernetes/
│       └── auth_deployment.yaml
│
├── chat_service/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── chat_app.py  # The main FastAPI application for chat
│   └── kubernetes/
│       └── chat_deployment.yaml
│
├── database_service/
│   └── kubernetes/
│       └── mongo_deployment.yaml
│
├── gateway/
│   ├── tor_config/  # Configuration for Tor proxy setup
│   ├── Dockerfile
│   └── kubernetes/
│       └── gateway_deployment.yaml
│
├── kubernetes/
│   ├── ingress.yaml
│   ├── configmaps.yaml
│   └── secrets.yaml
│
└── README.md



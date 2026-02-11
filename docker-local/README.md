# Docker Local Development Setup

This folder contains all Docker configuration files for local development. These files are specifically optimized for development workflow and should NOT be used in production.

## Files Overview

- `docker-compose.yml` - Main orchestration file for local development
- `Dockerfile.dev` - Backend (Flask) development container
- `Dockerfile.frontend` - Frontend (React/Vite) development container
- `.dockerignore` - Optimized ignore patterns for faster builds

## Quick Start

1. **Start all services:**
   ```bash
   cd docker-local
   docker-compose up
   ```

2. **Start specific services:**
   ```bash
   # Start only frontend
   docker-compose up frontend
   
   # Start only backend
   docker-compose up backend
   
   # Start only database
   docker-compose up db
   ```

3. **Build and start:**
   ```bash
   docker-compose up --build
   ```

4. **Run in background:**
   ```bash
   docker-compose up -d
   ```

## Services

### Database (PostgreSQL)
- **Port:** 5432
- **Container:** `flask-react-db-dev`
- **Volume:** `postgres_data` (persistent storage)

### Backend (Flask)
- **Port:** 3001
- **Container:** `flask-react-backend-dev`
- **Features:** Hot reload, mounted source code
- **Dependencies:** PostgreSQL

### Frontend (React/Vite)
- **Port:** 3000
- **Container:** `flask-react-frontend-dev`
- **Features:** Hot Module Replacement (HMR), mounted source code
- **Dependencies:** Backend

## Development Features

### Hot Reload
- **Backend:** Source code changes trigger automatic restart
- **Frontend:** Vite HMR for instant updates without full page refresh

### Volume Mounts
- Source code is mounted from host to container
- Changes are reflected immediately without rebuilding
- `node_modules` is protected from host interference

### Environment Variables
- Uses `.env.docker` file from project root
- Database connection and other settings configured there

## Useful Commands

```bash
# View logs
docker-compose logs [service-name]

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild a specific service
docker-compose build [service-name]

# Access container shell
docker-compose exec [service-name] sh

# View running containers
docker-compose ps
```

## Troubleshooting

### Port Conflicts
If ports 3000, 3001, or 5432 are already in use, modify the port mappings in `docker-compose.yml`.

### Permission Issues
On Linux/macOS, you might need to adjust file permissions for mounted volumes.

### Node Modules Issues
If you encounter node_modules problems:
```bash
docker-compose down -v
docker-compose up --build
```

### Database Connection Issues
Ensure PostgreSQL is healthy before starting backend:
```bash
docker-compose up db
# Wait for "healthy" status, then:
docker-compose up backend frontend
```

## Performance Tips

1. **Use Build Cache:** The Dockerfiles are optimized for layer caching
2. **Volume Optimization:** `.dockerignore` excludes unnecessary files
3. **Selective Mounts:** Only mount necessary directories
4. **Development Mode:** Services run in development mode with debugging enabled

## Cleanup

```bash
# Remove all containers and volumes
docker-compose down -v

# Remove unused Docker resources
docker system prune

# Remove specific volumes
docker volume rm docker-local_postgres_data
```

## Notes

- This setup is for **local development only**
- Not suitable for production deployment
- Files in this folder are excluded from Git (intentionally)
- Optimized for development workflow with hot reload and mounted volumes
# Docker Deployment Guide

This guide explains how to deploy the Slidex application using Docker and Docker Compose.

## Project Structure

The project consists of:
- **Frontend**: Next.js application (port 3000)
- **Backend**: FastAPI Python service (port 8000)

## Files Created

1. `Dockerfile.frontend` - Multi-stage Docker build for Next.js
2. `Dockerfile.backend` - Python FastAPI service with LibreOffice
3. `docker-compose.yml` - Orchestrates both services
4. `requirements.txt` - Python dependencies
5. `.dockerignore` - Excludes unnecessary files from Docker context
6. `.env.production` - Production environment variables template

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM
- 5GB free disk space

## Quick Start

### 1. Environment Setup

Copy the production environment file and update with your values:

```bash
cp .env.production .env
```

**Important**: Update these variables in `.env`:
- `NEXT_PUBLIC_BASE_URL` - Your domain (e.g., https://yourapp.com)
- `NEXT_PUBLIC_PYTHON_API_URL` - Backend URL (e.g., https://yourapp.com:8000)
- Replace API keys with your production keys

### 2. Build and Run

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 3. Verify Deployment

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
- Backend Health: http://localhost:8000/template_structure

## Production Deployment

### Remote Server Setup

1. **Transfer files to server:**
```bash
# Copy entire mistix directory to your server
scp -r mistix/ user@your-server:/path/to/app/
```

2. **Server preparation:**
```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
```

3. **Update environment variables:**
```bash
cd /path/to/app/mistix
cp .env.production .env

# Edit with your production values
nano .env
```

4. **Deploy:**
```bash
# Pull and build
docker-compose pull
docker-compose build

# Start services
docker-compose up -d

# Monitor logs
docker-compose logs -f
```

### Reverse Proxy Setup (Nginx)

Create `/etc/nginx/sites-available/slidex`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/python/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/slidex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Service Management

### Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart frontend
docker-compose restart backend

# View logs
docker-compose logs backend
docker-compose logs frontend

# Update and redeploy
docker-compose pull
docker-compose up -d --build

# Remove everything (including volumes)
docker-compose down -v
```

### Monitoring

```bash
# Check container status
docker-compose ps

# Monitor resource usage
docker stats

# Check backend health
curl http://localhost:8000/docs
```

## Volumes and Data Persistence

### Volumes Used

1. **Template Files** (`./public/templates:/app/public/templates:ro`)
   - Read-only mount of PowerPoint templates
   - Persistent across container restarts

2. **Temporary Files** (`backend-temp:/tmp`)
   - Stores temporary files for PDF conversion
   - Automatically managed by Docker

### Backup Strategy

```bash
# Backup templates
docker cp slidex_backend_1:/app/public/templates ./templates-backup

# Backup volumes
docker run --rm -v slidex_backend-temp:/source -v $(pwd):/backup alpine tar czf /backup/backend-temp.tar.gz -C /source .
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
```bash
# Check what's using the ports
sudo lsof -i :3000
sudo lsof -i :8000

# Change ports in docker-compose.yml if needed
```

2. **Build failures:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

3. **Backend health check fails:**
```bash
# Check backend logs
docker-compose logs backend

# Test backend directly
docker exec -it slidex_backend_1 curl http://localhost:8000/docs
```

4. **Permission issues:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod -R 755 .
```

### Logs and Debugging

```bash
# Real-time logs
docker-compose logs -f --tail=100

# Container inspection
docker inspect slidex_frontend_1
docker inspect slidex_backend_1

# Execute commands in container
docker exec -it slidex_backend_1 bash
docker exec -it slidex_frontend_1 sh
```

## Environment Variables Reference

### Frontend Variables
- `NEXT_PUBLIC_BASE_URL` - Frontend URL
- `NEXT_PUBLIC_PYTHON_API_URL` - Backend API URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key

### Backend Variables
- `OPENAI_API_KEY` - OpenAI API key
- `PEXELS_API_KEY` - Pexels API key
- `GOOGLE_API_KEY` - Google API key
- `TEMPLATE_PATH` - Default template path

## Security Considerations

1. **API Keys**: Never commit real API keys to version control
2. **Firewall**: Only expose necessary ports (80, 443)
3. **SSL**: Use HTTPS in production (consider Let's Encrypt)
4. **Updates**: Regularly update base images and dependencies

## Performance Optimization

1. **Resource Limits**: Add memory/CPU limits to docker-compose.yml
2. **Caching**: Use Docker BuildKit for better build caching
3. **CDN**: Serve static assets via CDN
4. **Database**: Consider external database for better performance

## Scaling

For high-traffic scenarios:

```yaml
# docker-compose.yml scaling example
frontend:
  deploy:
    replicas: 3
  
backend:
  deploy:
    replicas: 2
```

Use with:
```bash
docker-compose up -d --scale frontend=3 --scale backend=2

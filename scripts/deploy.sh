#!/bin/bash

# Deployment Script for AI Agent Builder
# This script automates the deployment process

set -e

echo "🚀 Starting AI Agent Builder deployment..."

# Configuration
PROJECT_NAME="ai-agent-builder"
DEPLOY_ENV=${1:-production}
BACKUP_DIR="./backups"
LOG_FILE="./deployment.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        warn ".env file not found. Creating from template..."
        cp .env.example .env || error "Failed to create .env file. Please create it manually."
        warn "Please update the .env file with your configuration before running the deployment again."
        exit 1
    fi
    
    log "Prerequisites check passed."
}

# Create necessary directories
setup_directories() {
    log "Setting up directories..."
    
    mkdir -p "$BACKUP_DIR"
    mkdir -p ./data
    mkdir -p ./ssl
    
    log "Directories created successfully."
}

# Backup existing data
backup_data() {
    if [ -d "./data" ] && [ "$(ls -A ./data)" ]; then
        log "Creating backup of existing data..."
        BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
        cp -r ./data/* "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
        log "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    fi
}

# Stop existing containers
stop_containers() {
    log "Stopping existing containers..."
    docker-compose down --remove-orphans 2>/dev/null || true
    log "Containers stopped."
}

# Build and start services
start_services() {
    log "Building and starting services..."
    
    # Pull latest images
    docker-compose pull
    
    # Build services
    docker-compose build --no-cache
    
    # Start services
    docker-compose up -d
    
    log "Services started successfully."
}

# Wait for services to be healthy
wait_for_health() {
    log "Waiting for services to be healthy..."
    
    # Wait for app to be ready
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/health &>/dev/null; then
            log "Application is healthy!"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            error "Application failed to become healthy within $max_attempts attempts."
        fi
        
        log "Waiting for application to be healthy... (attempt $attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Run Prisma migrations
    docker-compose exec app npx prisma db push
    
    log "Database migrations completed."
}

# Initialize default templates
initialize_templates() {
    log "Initializing default templates..."
    
    # Run template initialization
    docker-compose exec app npx ts-node -e "
      import { templateService } from './src/lib/template-service';
      templateService.initializeDefaultTemplates().then(() => {
        console.log('Templates initialized successfully');
        process.exit(0);
      }).catch((error) => {
        console.error('Failed to initialize templates:', error);
        process.exit(1);
      });
    "
    
    log "Default templates initialized."
}

# Perform health checks
health_checks() {
    log "Performing health checks..."
    
    # Check application health
    if curl -f http://localhost:3000/health &>/dev/null; then
        log "✅ Application health check passed"
    else
        error "❌ Application health check failed"
    fi
    
    # Check database connectivity
    if docker-compose exec app sqlite3 data/db.sqlite ".tables" &>/dev/null; then
        log "✅ Database connectivity check passed"
    else
        error "❌ Database connectivity check failed"
    fi
    
    # Check Redis connectivity (if enabled)
    if docker-compose ps redis | grep -q "Up"; then
        if docker-compose exec redis redis-cli ping | grep -q "PONG"; then
            log "✅ Redis connectivity check passed"
        else
            error "❌ Redis connectivity check failed"
        fi
    fi
    
    log "All health checks passed."
}

# Cleanup old backups
cleanup_backups() {
    log "Cleaning up old backups..."
    
    # Keep only the last 7 backups
    cd "$BACKUP_DIR"
    ls -t | tail -n +8 | xargs rm -rf 2>/dev/null || true
    cd ..
    
    log "Backup cleanup completed."
}

# Display deployment information
display_info() {
    log "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Deployment Information:"
    echo "   🌐 Application URL: http://localhost:3000"
    echo "   📊 Health Check: http://localhost:3000/health"
    echo "   📝 Logs: docker-compose logs -f"
    echo "   🛑 Stop: docker-compose down"
    echo "   🔄 Restart: docker-compose restart"
    echo ""
    echo "📁 Important Directories:"
    echo "   📂 Data: ./data"
    echo "   📂 Backups: $BACKUP_DIR"
    echo "   📂 SSL: ./ssl"
    echo ""
    echo "🔧 Useful Commands:"
    echo "   📊 View logs: docker-compose logs -f [service]"
    echo "   🔍 Debug mode: docker-compose run --rm app bash"
    echo "   📈 Monitor: docker-compose stats"
    echo ""
}

# Main deployment function
deploy() {
    log "Starting deployment for environment: $DEPLOY_ENV"
    
    check_prerequisites
    setup_directories
    backup_data
    stop_containers
    start_services
    wait_for_health
    run_migrations
    initialize_templates
    health_checks
    cleanup_backups
    display_info
    
    log "✅ Deployment completed successfully!"
}

# Handle script arguments
case "$1" in
    "dev")
        DEPLOY_ENV="development"
        log "Running in development mode..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
        ;;
    "prod")
        DEPLOY_ENV="production"
        deploy
        ;;
    "stop")
        log "Stopping services..."
        docker-compose down
        ;;
    "restart")
        log "Restarting services..."
        docker-compose restart
        ;;
    "logs")
        docker-compose logs -f "${2:-app}"
        ;;
    "status")
        docker-compose ps
        ;;
    "backup")
        backup_data
        ;;
    "health")
        health_checks
        ;;
    *)
        echo "Usage: $0 {dev|prod|stop|restart|logs|status|backup|health}"
        echo ""
        echo "Commands:"
        echo "  dev     - Start in development mode"
        echo "  prod    - Deploy to production"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - Show logs (service name optional)"
        echo "  status  - Show service status"
        echo "  backup  - Create backup"
        echo "  health  - Run health checks"
        exit 1
        ;;
esac
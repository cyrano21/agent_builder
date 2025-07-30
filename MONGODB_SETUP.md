# MongoDB Setup Guide

This guide will help you set up MongoDB for your Next.js project.

## Prerequisites

- Node.js and npm installed
- Docker (recommended) or MongoDB installed locally

## Option 1: Using Docker (Recommended)

### 1. Start MongoDB using Docker

```bash
# Start MongoDB container
docker run -d --name mongodb -p 27017:27017 mongo:7

# Optional: Start with persistent data
docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:7
```

### 2. Verify MongoDB is running

```bash
# Check container status
docker ps

# Test connection
docker exec -it mongodb mongosh --eval "db.stats()"
```

## Option 2: Install MongoDB Locally

### For Ubuntu/Debian:

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### For macOS (using Homebrew):

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### For Windows:

1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Follow the installation wizard
3. Start MongoDB as a service

## Option 3: MongoDB Atlas (Cloud)

### 1. Create a MongoDB Atlas account

- Go to https://www.mongodb.com/cloud/atlas
- Sign up for a free account
- Create a new cluster (free tier available)

### 2. Get your connection string

- From your cluster dashboard, click "Connect"
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user password

### 3. Update your environment variables

```bash
# .env.local
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/my-project?retryWrites=true&w=majority"
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/my-project?retryWrites=true&w=majority"
```

## Configure the Project

### 1. Update environment variables

Make sure your `.env.local` file contains:

```bash
# MongoDB Database
MONGODB_URI="mongodb://localhost:27017/my-project"
DATABASE_URL="mongodb://localhost:27017/my-project"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# AI Models (Z-AI Web Dev SDK)
ZAI_API_KEY="your-z-ai-api-key-here"
```

### 2. Generate Prisma client

```bash
npm run db:generate
```

### 3. Push schema to MongoDB

```bash
npm run db:push
```

### 4. Test the connection

```bash
node test-mongodb.js
```

## Using Docker Compose

The project includes Docker Compose configurations for easy setup:

### Development:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Production:

```bash
docker-compose up -d
```

This will start:
- Next.js application
- MongoDB database
- Redis (for caching)
- Nginx (reverse proxy)

## Verify Setup

1. Check if MongoDB is accessible:

```bash
# Using mongosh
mongosh mongodb://localhost:27017/my-project

# In the MongoDB shell
db.stats()
show collections
```

2. Test your application:

```bash
npm run dev
```

3. Visit http://localhost:3000 to verify the application is working

## Troubleshooting

### Common Issues:

1. **Connection refused**: Make sure MongoDB is running on port 27017
2. **Authentication failed**: Check your MongoDB credentials
3. **Database not found**: The database will be created automatically on first connection

### Logs:

```bash
# Check MongoDB logs (Docker)
docker logs mongodb

# Check MongoDB logs (local service)
sudo journalctl -u mongod -f
```

### Reset Database:

```bash
# Drop the database
mongosh mongodb://localhost:27017/my-project --eval "db.dropDatabase()"

# Or using Docker
docker exec -it mongodb mongosh my-project --eval "db.dropDatabase()"
```

## Next Steps

Once MongoDB is set up and working:

1. Run the database seed script to populate with sample data
2. Test the application features
3. Deploy to production with your MongoDB Atlas connection string

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong passwords for MongoDB authentication
- Enable MongoDB authentication in production
- Consider using MongoDB Atlas for production deployments
- Regularly backup your database
#!/bin/bash

# Database setup script for Slidex
echo "Setting up PostgreSQL database for Slidex..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL is not installed. Please install PostgreSQL first."
    echo "On macOS: brew install postgresql"
    echo "On Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo "Starting PostgreSQL service..."
    if command -v brew &> /dev/null; then
        brew services start postgresql
    else
        sudo systemctl start postgresql
    fi
fi

# Create database user if it doesn't exist
echo "Creating database user..."
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'password';" 2>/dev/null || echo "User 'postgres' already exists"

# Grant privileges to the user
echo "Granting privileges..."
sudo -u postgres psql -c "ALTER USER postgres CREATEDB;"

# Create database
echo "Creating database 'slidex'..."
sudo -u postgres createdb slidex -O postgres 2>/dev/null || echo "Database 'slidex' already exists"

# Run database migrations
echo "Running database migrations..."
sudo -u postgres psql -d slidex -f scripts/001-create-tables.sql

echo "Database setup complete!"
echo "You can now run 'npm run dev' to start the application."

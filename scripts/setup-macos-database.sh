#!/bin/bash

# macOS PostgreSQL setup script for Slidex
echo "Setting up PostgreSQL database for Slidex on macOS..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    brew install postgresql
fi

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
brew services start postgresql

# Create database (using current system user)
echo "Creating database 'slidex'..."
createdb slidex 2>/dev/null || echo "Database 'slidex' already exists"

# Run database migrations
echo "Running database migrations..."
psql -d slidex -f scripts/001-create-tables.sql

echo "Database setup complete!"
echo "Your database URL is: postgresql://$(whoami)@localhost:5432/slidex"
echo "You can now run 'npm run dev' to start the application."

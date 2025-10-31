# Database Setup Guide

## Quick Setup

### Option 1: Using the Setup Script (Recommended)

1. Make the script executable:
```bash
chmod +x scripts/setup-database.sh
```

2. Run the setup script:
```bash
./scripts/setup-database.sh
```

### Option 2: Manual Setup

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - macOS: `brew services start postgresql`
   - Ubuntu: `sudo systemctl start postgresql`

3. **Create database and user**:
```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create user and database
CREATE USER postgres WITH PASSWORD 'password';
ALTER USER postgres CREATEDB;
CREATE DATABASE slidex OWNER postgres;
\q
```

4. **Run database migrations**:
```bash
psql -h localhost -U postgres -d slidex -f scripts/001-create-tables.sql
```

## Alternative: Using Your Own PostgreSQL Credentials

If you want to use different credentials, update the `DATABASE_URL` in `.env.local`:

```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/slidex"
```

## Troubleshooting

### Error: "role 'postgres' does not exist"
- Run: `sudo -u postgres createuser postgres`
- Or update your DATABASE_URL with the correct username

### Error: "database 'slidex' does not exist"
- Run: `sudo -u postgres createdb slidex`

### Error: "password authentication failed"
- Make sure the password in DATABASE_URL matches your PostgreSQL user password
- Reset password: `sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"`

### Error: "connection refused"
- Make sure PostgreSQL is running:
  - macOS: `brew services start postgresql`
  - Ubuntu: `sudo systemctl start postgresql`

## Testing the Connection

After setup, you can test the connection:

```bash
psql -h localhost -U postgres -d slidex -c "SELECT version();"
```

If this works, your database is ready!

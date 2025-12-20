#!/bin/sh

DB_NAME="ecommerce_db"
PG_USER="admin"
BACKUP_FILE="/backups/backup_20251220_081822.sql"

echo "📦 Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432; do
  sleep 1
done

echo "🧹 Cleaning database before restore..."
psql -h postgres -U "$PG_USER" -d "$DB_NAME" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo "📦 Starting PostgreSQL restore..."
psql -h postgres -U "$PG_USER" -d "$DB_NAME" -f "$BACKUP_FILE"

echo "✅ Restore completed: $BACKUP_FILE"

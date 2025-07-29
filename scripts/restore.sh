#!/bin/sh

DB_NAME="ecommerce_db"
PG_USER="admin"
BACKUP_FILE="/backups/backup_20250721_154712.sql"

echo "📦 Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432; do
  sleep 1
done
echo "📦 Starting PostgreSQL restore..."
psql -h postgres -U "$PG_USER" -d "$DB_NAME" -f "$BACKUP_FILE"
echo "✅ Restore completed: "$BACKUP_FILE""

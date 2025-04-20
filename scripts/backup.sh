#!/bin/sh
echo "📦 Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432; do
  sleep 1
done
echo "📦 Starting PostgreSQL backup..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
pg_dump -h postgres -U postgres ecommerce_db > /backups/backup_$TIMESTAMP.sql

echo "✅ Backup completed: /backups/backup_$TIMESTAMP.sql"

#!/bin/sh
echo "📦 Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432; do
  sleep 1
done
echo "📦 Starting PostgreSQL restore..."
psql -h postgres -U postgres -d ecommerce_db -f /backups/backup_20250420_053841.sql
echo "✅ Restore completed: /backups/backup_20250420_053841.sql"

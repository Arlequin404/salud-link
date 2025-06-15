#!/usr/bin/env bash
# Espera a que PostgreSQL esté disponible antes de lanzar la app

host="$1"
shift
cmd="$@"

until nc -z "$host" 5433; do
  echo "⏳ Esperando a que $host:5433 esté disponible..."
  sleep 1
done

echo "✅ $host:5433 está listo. Ejecutando la aplicación..."
exec $cmd

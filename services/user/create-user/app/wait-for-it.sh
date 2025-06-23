#!/usr/bin/env bash
host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z "$host" "$port"; do
  echo "⏳ Esperando a que $host:$port esté disponible..."
  sleep 1
done

echo "✅ $host:$port está listo. Ejecutando la aplicación..."
exec $cmd

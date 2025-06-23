#!/bin/sh
# Espera hasta que un host:puerto esté disponible

host="$1"
shift
cmd="$@"

until nc -z ${host%:*} ${host#*:}; do
  >&2 echo "Esperando a $host..."
  sleep 1
done

>&2 echo "$host está disponible — ejecutando comando"
exec $cmd

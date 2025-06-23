#!/usr/bin/env bash

host="$1"
shift
cmd="$@"

until nc -z $(echo $host | cut -d: -f1) $(echo $host | cut -d: -f2); do
  >&2 echo "⏳ Waiting for $host..."
  sleep 1
done

>&2 echo "✅ $host is available. Running command..."
exec $cmd

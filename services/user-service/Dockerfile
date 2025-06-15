# Imagen base
FROM python:3.12-slim

WORKDIR /app

# Instalar netcat (OpenBSD)
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . .

RUN chmod +x wait-for-it.sh

EXPOSE 8081

CMD ["./wait-for-it.sh", "host.docker.internal", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]

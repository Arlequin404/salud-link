FROM python:3.11-slim

WORKDIR /app

# 🔧 Agrega esto:
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x ./app/wait-for-it.sh

CMD ["./app/wait-for-it.sh", "auth-user-db:5432", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000"]

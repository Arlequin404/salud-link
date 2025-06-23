FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd postgresql-client && apt-get clean

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

RUN chmod +x ./app/wait-for-it.sh

CMD ["./app/wait-for-it.sh", "create-user-db", "5432", "--", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8081"]

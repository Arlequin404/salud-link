FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copia los archivos de dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copia el código fuente
COPY . .

# Compila el binario (llámalo 'service')
RUN go build -o service .

# Imagen final ligera
FROM alpine:3.19

WORKDIR /app

COPY --from=builder /app/service .
COPY .env .

EXPOSE 8014

CMD ["./service"]

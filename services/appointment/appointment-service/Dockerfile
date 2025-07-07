FROM golang:1.21-alpine
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
EXPOSE ${PORT}
CMD ["go", "run", "cmd/main.go"]

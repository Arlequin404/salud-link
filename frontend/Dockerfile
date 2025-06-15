# Etapa 1: build
FROM node:20 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: producción
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Opcional: elimina el archivo default.conf y usa uno propio si deseas
EXPOSE 80

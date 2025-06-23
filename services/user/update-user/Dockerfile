FROM node:20-alpine
WORKDIR /app

# Copiar los archivos de dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el script y darle permisos
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

# Copiar el resto de la app
COPY . .

# Esperar a que la base de datos esté lista y luego ejecutar el servicio
CMD ["./wait-for-it.sh", "update-user-db:5432", "--", "node", "index.js"]

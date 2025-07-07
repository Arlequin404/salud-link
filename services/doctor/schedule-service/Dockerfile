FROM node:20-alpine

WORKDIR /usr/src/app

# Copia sólo package.json primero
COPY package*.json ./

# Instala deps
RUN npm install --production

# Copia el resto
COPY . .

# Expone el puerto que usas en docker-compose (8012)
EXPOSE 8012

# Lanza el start que definimos en package.json
CMD ["npm","start"]

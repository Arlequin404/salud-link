FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev        

COPY . .
EXPOSE 8000
CMD ["npm", "start"]

# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Vite corre por defecto en el puerto 5173
EXPOSE 5173

# Arranca en modo desarrollo permitiendo conexiones externas
CMD ["npm", "run", "dev", "--", "--host"]
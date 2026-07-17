# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R node:node /app
USER node

# Vite corre por defecto en el puerto 5173
EXPOSE 5173

# Arranca en modo desarrollo permitiendo conexiones externas
CMD ["npm", "run", "dev", "--", "--host"]
# frontend/Dockerfile

# --- ETAPA 1: Build (solo se usa para producción) ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite incrusta las variables VITE_* en el bundle al momento del build, no en runtime,
# así que la URL de la API tiene que estar disponible acá como build arg.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- ETAPA 2: Ejecución ---
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./

# Mismo truco que backend/Dockerfile: en desarrollo instalamos todo para que Vite dev server
# funcione con el bind mount de docker-compose; en producción solo necesitamos "serve" para
# servir el estático ya compilado.
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then npm install -g serve; else npm install; fi

COPY . .
COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app
USER node

# Vite dev server corre en 5173; en producción Railway inyecta PORT dinámicamente.
EXPOSE 5173

# "serve -s" trata la app como SPA: cualquier ruta no encontrada cae a index.html,
# necesario porque React Router maneja el ruteo del lado del cliente.
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then serve -s dist -l ${PORT:-5173}; else npm run dev -- --host; fi"]

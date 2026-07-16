# --- ETAPA 1: Compilación ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# Instalamos absolutamente todas las dependencias (incluyendo TS y herramientas de dev)
RUN npm install

COPY . .
RUN npm run build

# --- ETAPA 2: Ejecución ---
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./

# Aquí está el truco clave:
# Si estamos en desarrollo, instalamos TODO (incluyendo devDependencies para que nodemon funcione).
# Si estamos en producción, solo instalamos las dependencias necesarias.
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; then npm install; else npm install --only=production; fi

COPY prisma ./prisma/
RUN npx prisma generate

# Copiamos el código compilado
COPY --from=builder /app/dist ./dist
# Copiamos el resto de archivos (necesario para leer src/ en caliente)
COPY . .

EXPOSE 4000

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev; else npm start; fi"]
# --- ETAPA 1: Compilación ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# Instalamos absolutamente todas las dependencias (incluyendo TS y herramientas de dev)
RUN npm install

COPY . .
# El postinstall de @prisma/client corrió antes de que existiera schema.prisma en la imagen,
# así que regeneramos el cliente ahora que el schema real ya está copiado.
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate
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
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate

# Copiamos el código compilado.
# En desarrollo, docker-compose monta ./backend:/app encima de esto, así que src/
# también queda disponible para nodemon; en producción solo se necesita dist/.
COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app
USER node

EXPOSE 4000

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev; else npm start; fi"]
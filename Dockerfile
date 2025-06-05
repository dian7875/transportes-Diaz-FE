# Stage 1: Build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve
FROM node:18-slim

WORKDIR /app

RUN npm install -g serve

# Copiar solo la carpeta browser dentro del dist (que tiene el index.html)
COPY --from=build /app/dist/transportes-diaz-fe/browser ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]

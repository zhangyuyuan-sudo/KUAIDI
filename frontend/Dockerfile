FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    PORT=5173 \
    VITE_API_BASE_URL=https://exp-service-backend.runnto.com/api

RUN npm install -g serve@14.2.4

COPY --from=build /app/dist ./dist
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 5173

CMD ["./docker-entrypoint.sh"]

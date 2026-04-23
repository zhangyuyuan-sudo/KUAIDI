FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    PORT=5173

RUN npm install -g serve@14.2.4

COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["sh", "-c", "serve -s dist -l ${PORT:-5173}"]

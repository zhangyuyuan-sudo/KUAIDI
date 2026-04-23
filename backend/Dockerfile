FROM node:20-bookworm-slim

ENV NODE_ENV=production \
    PORT=3000 \
    LOG_LEVEL=info \
    PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
COPY --chown=node:node data ./data

RUN install -d -o node -g node /app/logs

USER node

EXPOSE 3000

CMD ["npm", "start"]

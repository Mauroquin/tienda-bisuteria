FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN mkdir -p uploads

EXPOSE 10000

CMD ["sh", "-c", "node scripts/migrate.js && node scripts/seedAdmin.js && node server.js"]

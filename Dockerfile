# g++ required for C++ compilation; python3/make for native addons (better-sqlite3)
FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 7860

CMD ["npm", "start"]

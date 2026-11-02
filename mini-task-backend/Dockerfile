
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN DATABASE_URL="postgresql://user:password@localhost:5432/database" npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]

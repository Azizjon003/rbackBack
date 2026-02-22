FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
RUN npx tsc --project tsconfig.prod.json

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node -r dotenv/config -r module-alias/register ./dist/src/main.js"]

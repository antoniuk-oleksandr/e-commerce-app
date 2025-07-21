FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

RUN npm install @nestjs/cli

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/src/main"]

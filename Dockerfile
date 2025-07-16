FROM node:24-alpine

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install --omit=dev

RUN npm install @nestjs/cli

COPY . .

RUN npx prisma generate

RUN npx nest build

EXPOSE 8080

CMD ["node", "dist/main"]

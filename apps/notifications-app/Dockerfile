FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY ./dist/apps/notifications-app .

EXPOSE 3333

ENV MONGO_URL="mongodb"
ENV SMTP_URL="mailslurper"

CMD [ "node", "main.js" ]

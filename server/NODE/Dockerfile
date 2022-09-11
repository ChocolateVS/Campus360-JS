FROM node:18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./


RUN mkdir /images

RUN npm install
COPY .env ./
COPY *.js ./
ADD Campus360-JS ./

EXPOSE 3000
CMD ["node", "index.js"]



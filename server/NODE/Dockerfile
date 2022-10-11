FROM node:18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY .env ./
COPY *.js ./
ADD ../images ./images
ADD models ./models
ADD routes ./routes
ADD ../../client ./client

EXPOSE 3000
CMD ["node", "index.js"]



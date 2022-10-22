FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY server/package*.json ./

COPY server/.env ./
COPY server/*.js ./
ADD server/models ./models
ADD server/routes ./routes

ADD server/images ./images
ADD client ../client
EXPOSE 3001
CMD ["npm", "run", "start"]



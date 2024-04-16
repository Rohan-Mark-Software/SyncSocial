FROM node:20

# set env as secrets not arg

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN node install

COPY ./src ./src

EXPOSE 3000

CMD ["node", "src/main.js"]
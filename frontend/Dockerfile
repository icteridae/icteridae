FROM node:lts

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH


COPY package.json ./
COPY yarn.lock ./

RUN yarn --silent

CMD ["yarn", "start"]
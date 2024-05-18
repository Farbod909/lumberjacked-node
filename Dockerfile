FROM node:20-alpine

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

RUN npm run build

USER node

CMD [ "npm", "run", "start:prod" ]
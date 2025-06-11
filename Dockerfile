FROM node:alpine

ENV PORT 3000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

# Production use node instead of root
# USER node

RUN yarn install 

COPY . /usr/src/app

RUN yarn build

EXPOSE 3000

# Running the app
CMD [ "npm", "start"]
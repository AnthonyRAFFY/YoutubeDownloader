FROM node:alpine as dev

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Same as npm install, but for automatic envs.
RUN npm ci

COPY ./ /app

CMD [ "npm", "start" ]
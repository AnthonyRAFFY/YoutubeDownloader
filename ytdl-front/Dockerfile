FROM node:alpine as dev

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Vite specific files
COPY index.html /app/index.html
COPY vite.config.js /app/vite.config.js

# Same as npm install, but for automatic envs.
RUN npm ci

COPY ./public /app/public

CMD [ "npm", "start" ]
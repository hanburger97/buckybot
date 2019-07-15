FROM node:8-alpine
ARG XNPM_READ_TOKEN_ARG
ENV XNPM_READ_TOKEN $XNPM_READ_TOKEN_ARG


WORKDIR /usr/src/app
# Install app dependencies
COPY package.json package-lock.json ./
COPY .npmrc .npmrc
RUN npm install

EXPOSE 8001

COPY . .
CMD node /usr/src/app/src/main.js
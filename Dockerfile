FROM node:6-alpine
EXPOSE 8080

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
CMD [ "npm", "start" ]

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
RUN npm install && npm cache clean

# Seperate source copy for seperate caching ;)
COPY . /usr/src/app
RUN npm run build

LABEL Name="ptc-sms-getway" \
      Version="1.0.0"

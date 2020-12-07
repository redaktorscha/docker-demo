FROM node:12

WORKDIR /src

ADD index.js /src/index.js
ADD app.js /src/app.js

COPY package*.json ./

RUN npm install


EXPOSE 3000

CMD [ "node", "index.js" ]
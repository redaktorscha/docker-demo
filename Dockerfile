FROM node:14.8.0-alpine3.12

WORKDIR /src
ADD index.js /src/index.js
ADD app.js /src/app.js
ADD package.json /src/package.json
RUN npm install


EXPOSE 3000

CMD node /src/index.js
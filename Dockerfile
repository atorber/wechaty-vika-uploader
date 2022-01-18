FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
RUN npm install qrcode-terminal
RUN npm install wechaty@0.73.8
RUN npm install better-sqlite3
COPY . .
CMD [ "node", "examples/ding-dong-bot.js" ]
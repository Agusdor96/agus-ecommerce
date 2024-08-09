FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env.development ./

EXPOSE 3001

CMD ["npm", "run", "start"]
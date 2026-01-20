FROM node:24.13.0-alpine3.23

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 10000

CMD ["npm", "run", "dev", "--", "-p", "10000"]

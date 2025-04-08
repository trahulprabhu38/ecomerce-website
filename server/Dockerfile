FROM node:latest

WORKDIR /app

COPY package*. .

RUN npm install 

COPY . .

EXPOSE 3000

CMD ["npm","start"]
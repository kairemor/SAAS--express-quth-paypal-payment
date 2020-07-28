FROM node:12.18.2-alpine3.9
EXPOSE 3000 

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm install 

COPY . /home/app
COPY .env home/app

CMD ["npm", "start"]


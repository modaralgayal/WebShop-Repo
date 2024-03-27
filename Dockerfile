FROM node:16

WORKDIR /app

COPY Backend/package*.json ./

RUN npm install

COPY Backend/ .

EXPOSE 3001

CMD ["npm", "run", "dev"]

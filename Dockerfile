FROM node:14

WORKDIR /app

COPY Backend/package*.json ./

RUN npm install

COPY Backend/ .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]

#server/Dockerfile
FROM node:22

#set working directory
WORKDIR /app

#copy package.json and package-lock.json
COPY package*.json ./

#install dependencies
RUN npm install

#copy the rest of the server code 
COPY . .

#expose the port (same as yout .env)
EXPOSE 5000

#start the app
CMD ["npm","run","dev" ]
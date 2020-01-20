FROM node:10
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
ENTRYPOINT ["./generate_docker.sh"]
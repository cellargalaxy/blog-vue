FROM node:10
WORKDIR /src
COPY . .
RUN npm install
ENTRYPOINT ["/src/generate_docker.sh"]
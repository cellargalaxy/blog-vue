FROM node:10
WORKDIR /src
COPY . .
RUN npm install
RUN ["chmod", "+x", "/src/generate-docker.sh"]
ENTRYPOINT ["/src/generate-docker.sh"]
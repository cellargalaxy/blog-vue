FROM node:10.16.0
MAINTAINER cellargalaxy

ENV APP_ROOT /app
RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

ENV NODE_ENV=production
ENV HOST 0.0.0.0
EXPOSE 3000
#If the environment in China build please open the following comments
#如果在中国环境下构建请把下面注释打开
#RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
RUN npm run build
CMD nohup sh -c 'nohup node assets/clone/articleClone.js && npm start'
FROM node

################################################
# WEBAPP
################################################

ENV APP_PATH /opt/webapp
RUN mkdir /opt/webapp

COPY package.json $APP_PATH

RUN \
    npm install -g serve \
    && cd $APP_PATH \
    && npm install

ENV UPDATE 1
COPY public $APP_PATH/public
COPY src $APP_PATH/src

WORKDIR $APP_PATH
ENTRYPOINT npm start

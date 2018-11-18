FROM node

################################################
# WEBAPP
################################################

ENV APP_PATH /opt/webapp
RUN mkdir /opt/webapp

COPY package.json $APP_PATH
COPY public $APP_PATH/public
COPY src $APP_PATH/src

RUN \
    npm install -g serve \
    && cd $APP_PATH \
    && npm install \
    && npm run build --production

WORKDIR $APP_PATH
ENTRYPOINT exec serve -p 80 -s build

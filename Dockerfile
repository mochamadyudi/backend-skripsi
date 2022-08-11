FROM node:16

# FROM base as production
WORKDIR /usr/src/skripsi/backend

ADD start.sh /
RUN chmod +x /start.sh

RUN apt-get update; apt-get install curl -y; apt-get install zip -y

COPY . /usr/src/skripsi/backend/

RUN npm install

EXPOSE 5000
CMD [ "/start.sh" ]

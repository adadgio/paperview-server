FROM node:9

ENV NODE_ENV=production
ENV APP_EXPRESS_PORT=8291

RUN apt-get update &&  apt-get install -y \
    build-essential \
    pdftk \
    ghostscript \
    libreoffice \
    poppler-utils \
    pdfgrep \
    optipng \
    libjpeg-turbo-progs \
    gifsicle \
    libcairo2-dev \
    libjpeg62-turbo-dev \
    libpango1.0-dev \
    libgif-dev \
    g++

RUN npm install -g npm \
    npm install pm2 -g \
    npm install svgo -g

COPY dist /app
COPY build.sh /app/build
WORKDIR /app
RUN npm install --only=production --loglevel error
RUN npm run build

# docker containers require processes to run in the forground
# so --no-daemon options needs to be specified
CMD ["pm2", "start", "pm2.yml", "--no-daemon"]

# paperview-server

This is the **paperview** NodeJS server that can convert any document to viewable assets (see [paperview-js](https://github.com/adadgio/paperview-js) to display them).

It's a perfect open source candidate to replace the **Crocodoc** and **Box View** legacy payed service (and a perfectly good reason not to use their new solution clearly based on open `mozilla/pdfjs` which does not support offline assets).

## Endpoints

// convert doc, pdf, ppt, docx, pptx to html/svg/png assets
/convert -x POST

## Install

Server side requirements (and hints):

- build-essential
- pdftk ghostscript libreoffice poppler-utils pdfgrep
- optipng libjpeg-turbo-progs gifsicle
- libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev
- Lastly (and very strange), svgo needs to be installed globaly - just like cors(?) - (wont work if installed only locally- no idea why!)

NodeJs global packages requirements:

```
npm install pm2 -g
npm install svgo -g
```

## Use and develop

On a server run `pm2 start pm2.yml` in the project.

Locally or for developement purposes run `npm install`, `npm run watch` and `npm start`.

## Docker quick start

Docker containers statuses, building, launching, deleting and cleaning.

```
docker ps
docker network ls

docker build -t oops .
docker run -p 4000:80 oops

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)

docker system prune
docker system prune -a
```

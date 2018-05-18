#!/usr/bin/env bash

rm -rf ./dist/*
mkdir -p ./dist/environments

cp ./pm2.yml ./dist/pm2.yml
cp ./package.json ./dist/package.json
cp ./src/environments/*.json ./dist/environments

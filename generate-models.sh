#!/bin/bash

ROOT_DIR='scrape/fftoolbox'

rm -rf $ROOT_DIR/models/

mkdir $ROOT_DIR/temp

lb-sdk server/server.js $ROOT_DIR/temp

mkdir $ROOT_DIR/models

cp -R $ROOT_DIR/temp/models/. $ROOT_DIR/models

rm -rf $ROOT_DIR/temp

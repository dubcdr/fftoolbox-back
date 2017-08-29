#!/bin/bash

ROOT_DIR='scrape/fftoolbox'
TEMP_DIR=$ROOT_DIR/temp
MODEL_DIR=$ROOT_DIR/models

rm -rf $MODEL_DIR

mkdir $TEMP_DIR

lb-sdk server/server.js $TEMP_DIR

mkdir $MODEL_DIR

cp -R $TEMP_DIR/models/. $MODEL_DIR

rm $MODEL_DIR/FireLoop.ts $MODEL_DIR/FireLoopRef.ts

sed -i '' '/FireLoopRef/g' scrape/fftoolbox/models/index.ts

rm -rf $ROOT_DIR/temp

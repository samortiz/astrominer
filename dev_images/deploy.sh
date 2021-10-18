#!/bin/bash

TARGET_DIR='../public/images'

echo 'copying spritesheets'
cp spritesheet/spritesheet.png $TARGET_DIR
cp spritesheet/spritesheet.json $TARGET_DIR
cp crash/crash.png $TARGET_DIR
cp crash/crash.json $TARGET_DIR
cp smoke_spritesheet/smoke.png $TARGET_DIR
cp smoke_spritesheet/smoke.json $TARGET_DIR

echo 'copying non-spritesheet resources'
cp public/* $TARGET_DIR
cp credits.txt $TARGET_DIR

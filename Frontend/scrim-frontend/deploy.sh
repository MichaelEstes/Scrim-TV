#! /bin/bash
npm run build
aws s3 cp --recursive ./dist s3://frontend
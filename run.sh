#!/bin/bash

# docker-compose down
# rm -rf devnet/
# git checkout devnet
# docker-compose up -d

cd quorum
docker-compose down
docker-compose up -d
cd ..

sleep 20

# cd circuits
# ./bootstrap.sh
# cd ..

truffle build --reset
echo "Running some sample transactions"

node deploy.js

sleep 5

node prepareBetContract.js

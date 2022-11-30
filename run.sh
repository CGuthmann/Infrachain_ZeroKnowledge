#!/bin/bash

docker-compose down
git checkout devnet
docker-compose up -d

sleep 5

# cd circuits
# ./bootstrap.sh
# cd ..

truffle build --reset
echo "Running some sample transactions"

node deploy.js
node prepareBetContract.js

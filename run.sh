#!/bin/bash

# docker-compose down
# rm -rf devnet/
# git checkout devnet
# docker-compose up -d

cd quorum
docker-compose down
docker-compose up -d
cd ..

sleep 5

cd frontend
docker-compose down
docker-compose up -d
cd ..

echo "Waiting frontend to launch on 3000..."
while ! [[ $(curl --fail http://localhost:3000 | grep '<!DOCTYPE html>') == '<!DOCTYPE html>' ]]; do
  sleep 10
done
echo "Frontend launched"

cd circuits
./bootstrap.sh
cd ..

truffle build --reset
echo "Running some sample transactions"

node deploy.js

sleep 5

node prepareGame.js

sleep 5

node playGame.js

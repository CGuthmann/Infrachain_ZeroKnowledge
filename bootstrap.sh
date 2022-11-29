#!/bin/bash

echo "Installing basic dependencies"
sudo apt-get install -y curl

echo "Installing node"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
nvm install 18

echo "Installing docker"
sudo apt-get install -y docker.io
sudo apt-get install -y docker-compose 

echo "Handling docker permissions"
sudo groupadd docker
sudo usermod -aG docker $USER

docker run hello-world || echo "Please exit your shell or restart"

echo "Starting the local Ethereum blockchain network"
docker-compose up -d

echo "Setting up truffle"
npm i -g truffle
truffle init

echo "Preparing the ZKP trusted setups and deploying the corresponding verifiers"
cd circuits 
./bootstrap.sh A
./bootstrap.sh B
./bootstrap.sh C

truffle build --reset

echo "Running some sample transactions"
node test.js

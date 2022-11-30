#!/bin/bash

# cd circuits
# ./bootstrap.sh
# cd ..

truffle build --reset
echo "Running some sample transactions"

node deploy.js
#node sendProofs.js

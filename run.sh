#!/bin/bash

# cd circuits
# ./bootstrap.sh
# cd ..

truffle build --reset
echo "Running some sample transactions"

node test.js

#!/bin/bash

cd circuits 
./bootstrap.sh A
cd ..

truffle build --reset

node test.js

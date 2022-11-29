#!/bin/bash

cd circuits 
bootstrap.sh A 
bootstrap.sh B
bootstrap.sh C

truffle build --reset

node test.js

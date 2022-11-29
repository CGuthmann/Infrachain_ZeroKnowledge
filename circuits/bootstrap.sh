#!/bin/bash

./setup.sh circuit_participant
./setup.sh circuit_total

node generateInput_A.js
node generateInput_B.js
node generateInput_C.js
node generateInput_total.js

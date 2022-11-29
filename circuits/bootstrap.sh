#!/bin/bash

./setup.sh circuit_participant
./setup.sh circuit_total

node generateInputs_A.js
node generateInputs_B.js
node generateInputs_C.js
node generateInputs_D.js

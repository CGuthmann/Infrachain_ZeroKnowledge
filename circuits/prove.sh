#!/bin/bash

START=$(date +%s%N/1000000)
cd circuit_cpp && ./circuit ../input.json witness.wtns && cd ..
../prover circuit_0001.zkey ./circuit_cpp/witness.wtns proof.json public.json
END=$(date +%s%N/1000000)
DIFF=$(echo "$END - $START" | bc)
echo $DIFF
#!/bin/bash

CIRCUIT_NAME=$1

node generateInput_$CIRCUIT_NAME.js

circom $CIRCUIT_NAME.circom --r1cs --wasm --sym

cd ..

FILE=./powersOfTau28_hez_final_16.ptau
if test -f "$FILE"; then
    echo "Phase-1 trusted setup already pulled - continue with Phase-2."
else
    echo "Pulling Phase-1 trusted setup from Hermez repository..."
    wget -q https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_16.ptau
fi

cd circuits

START=$(date +%s.%N)
snarkjs groth16 setup $CIRCUIT_NAME.r1cs ../powersOfTau28_hez_final_16.ptau "$CIRCUIT_NAME"_0000.zkey
snarkjs zkey contribute "$CIRCUIT_NAME"_0000.zkey "$CIRCUIT_NAME"_0001.zkey --name="1st Contributor Name" -v --entropy="Hallo"
snarkjs zkey export verificationkey "$CIRCUIT_NAME"_0001.zkey verification_key_$CIRCUIT_NAME.json
END=$(date +%s.%N)
DIFF=$(echo "$END - $START" | bc)
echo "Setup took $DIFF seconds"

# echo "Proof creation with node"
# snarkjs groth16 fullprove ./input_$CIRCUIT_NAME.json "$CIRCUIT_NAME"_js/$CIRCUIT_NAME.wasm "$CIRCUIT_NAME"_0001.zkey proof_"$CIRCUIT_NAME"_$CIRCUIT_NAME.json public_"$CIRCUIT_NAME"_$CIRCUIT_NAME.json
# START=$(date +%s.%N)

# END=$(date +%s.%N)
# DIFF=$(echo "$END - $START" | bc)
# echo "Prove took $DIFF seconds"

# snarkjs groth16 verify verification_key_$CIRCUIT_NAME.json public_"$CIRCUIT_NAME"_$CIRCUIT_NAME.json proof_"$CIRCUIT_NAME"_$CIRCUIT_NAME.json
# rm public.json proof.json

snarkjs zkey export solidityverifier "$CIRCUIT_NAME"_0001.zkey verifier_$CIRCUIT_NAME.sol

sed -i -e 's/pragma solidity ^0.6.11;/pragma solidity ^0.8.17;/g' verifier_$CIRCUIT_NAME.sol
sed -i -e 's/contract Verifier {/contract Verifier_Participants {/g' verifier_$CIRCUIT_NAME.sol

cp verifier_$CIRCUIT_NAME.sol ../contracts
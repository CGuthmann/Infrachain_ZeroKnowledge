pragma circom 2.0.6;

include "../node_modules/circomlib/circuits/poseidon.circom";

template ZKP_MPC_Total() {

    signal input totalSum;
    signal input r;
    signal input private_consumption;

    component hasherPrivateConsumption = Poseidon(1);
    hasherPrivateConsumption.inputs[0] <== private_consumption;

    signal output comPrivateConsumption;
    comPrivateConsumption <== hasherPrivateConsumption.out;


    component hasherRa = Poseidon(1);
    hasherRa.inputs[0] <== r + private_consumption;

    signal output comRa;
    comRa <== hasherRa.out;

    
    component hasherTotalSum = Poseidon(1);
    hasherTotalSum.inputs[0] <== totalSum;

    signal output comTotalSum;
    comTotalSum  <== hasherTotalSum.out;

    signal output total;
    total <== totalSum - r; 

}

component main = ZKP_MPC_Total();
pragma circom 2.0.6;

include "../node_modules/circomlib/circuits/poseidon.circom";

template ZKP_MPC_Total() {

    signal input sumWithR;
    signal input r;
    signal input a;

    component hasherA = Poseidon(1);
    hasherA.inputs[0] <== a;

    signal output comA;
    comA <== hasherA.out;


    component hasherRa = Poseidon(1);
    haherR.inputs[0] <== r + a;

    signal output comR;
    comR <== hasherR.out;

    
    component hasherSumWithR = Poseidon(1);
    hasherSumWithR.inputs[0] <== sumWithR;

    signal output comSumWithR;
    comSumWithR  <== sumWithR.out;

    signal output total;
    total <== sumWithR - r; 

}

component main = ZKP_MPC_Total();
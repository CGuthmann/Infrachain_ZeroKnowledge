/*
    Copyright 2018 0KIMS association.

    This file is part of circom (Zero Knowledge Circuit Compiler).

    circom is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    circom is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with circom. If not, see <https://www.gnu.org/licenses/>.
*/
pragma circom 2.0.6;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "./EdDSAPoseidonVerifier.circom";


template ZKP_MPC_A() {

    
    signal input current_sum; //= r for first participant
    //log("r: ", current_sum);

    signal input enabled;
    //log("enabled: ", enabled);
    signal input Ax;
    //log("Ax: ", Ax);
    signal input Ay;
    //log("Ay: ", Ay);

    signal input S;
    //log("S: ", S);
    signal input R8x;
    //log("R8x: ", R8x);
    signal input R8y;
    //log("R8y: ", R8y);

    signal input private_consumption;
    //log("M: ", M);

    component signatureVerifier = EdDSAPoseidonVerifier();
    signatureVerifier.enabled <== enabled;
    signatureVerifier.Ax <== Ax;
    signatureVerifier.Ay <== Ay;
    signatureVerifier.S <== S;
    signatureVerifier.R8x <== R8x;
    signatureVerifier.R8y <== R8y;
    signatureVerifier.M <== private_consumption;

    signatureVerifier.out === 1;

    signal output comR;

    component hasherR = Poseidon(1);
    hasherR.inputs[0] <== private_consumption;

    comR <== hasherR.out;

    signal output comRa;

    component hasherRa = Poseidon(1);
    hasherRa.inputs[0] <== current_sum + private_consumption;

    comRa <== hasherRa.out;

}

component main = ZKP_MPC_A();
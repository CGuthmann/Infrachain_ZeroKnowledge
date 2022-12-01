pragma circom 2.0.6;
include "../node_modules/circomlib/circuits/bitify.circom";

//calculates in^(2^0), in^(2^1 ),..., in^(2^(n-1))
template second_powers(n){
    signal input in;
    signal output out[n];

    out[0] <== in;
    for(var i = 0; i <n-1;i++){
        out[i+1] <== out[i] * out[i];
    }
}

template rsa_encrypt(n){
    signal input m;

    signal input e;
    signal input N;

    //publishing public key
    signal output e_out <== e;
    signal output N_out <== N;

    component second_powers_m = second_powers(n);
    second_powers_m.in <== m;

    component  e_bits = Num2Bits(n);
    e_bits.in <== e;

    signal factors[n];
    signal trace[n];
    signal nfactors[n];

    factors[0] <== e_bits.out[0]* second_powers_m.out[0];
    trace[0] <== factors[0];

    for(var i = 0; i < n-1 ; i++){
        factors[i+1] <==  trace[i] * second_powers_m.out[i+1];

        trace[i+1] <== e_bits.out[i+1] * (factors[i+1]-trace[i])+trace[i];
    }

    signal output c <-- trace[n-1] % N;
    signal factor <-- trace[n-1] \ N;
    trace[n-1] === factor*N + c;


}

component main = rsa_encrypt(250);
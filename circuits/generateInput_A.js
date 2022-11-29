const buildEddsa = require("circomlibjs").buildEddsa;
const buildBabyjub = require("circomlibjs").buildBabyjub;
const chai = require("chai");

// require('json-bigint-patch');

const fs = require("fs");
const config = require("./config.json");
//console.log(config);


async function createInputs() {

    const eddsa = await buildEddsa();
    const babyJub = await buildBabyjub();
    const F = babyJub.F;
    const msg = F.e(1234);


    let r = 0;
    while (r < 1000) {
        r = Math.round(Math.random() * 10000000);
    }
    console.log("Randomness: " + r);

    const prvKey = Buffer.from(config.privateKey, "hex");

    const pubKey = eddsa.prv2pub(prvKey);
    console.log("Public key: " + pubKey);

    const signature = eddsa.signPoseidon(prvKey, msg);

    chai.assert(eddsa.verifyPoseidon(msg, signature, pubKey));

    const input = {
        enabled: 1,
        Ax: F.toObject(pubKey[0]).toString(),
        Ay: F.toObject(pubKey[1]).toString(),
        R8x: F.toObject(signature.R8[0]).toString(),
        R8y: F.toObject(signature.R8[1]).toString(),
        S: signature.S.toString(),
        a: F.toObject(msg).toString(),
        r: r 
    };

    console.log(input);

    fs.writeFileSync("input_circuit_A.json", JSON.stringify(input, null, 4));
}

createInputs();

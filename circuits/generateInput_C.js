const buildEddsa = require("circomlibjs").buildEddsa;
const buildBabyjub = require("circomlibjs").buildBabyjub;
const chai = require("chai");

// require('json-bigint-patch');

const fs = require("fs");
const config = require("./config.json");
//console.log(config);


async function createInputs() {

    const private_consumption = 3456;

    const input_B = JSON.parse(fs.readFileSync("input_B.json"));

    console.log(input_B);

    const current_sum = input_B.current_sum + input_B.private_consumption;

    const eddsa = await buildEddsa();
    const babyJub = await buildBabyjub();
    const F = babyJub.F;
    const msg = F.e(private_consumption);


    const prvKey = Buffer.from(config.privateKey, "hex");

    const pubKey = eddsa.prv2pub(prvKey);
    console.log("Public key: " + pubKey);

    const signature = eddsa.signPoseidon(prvKey, msg);

    chai.assert(eddsa.verifyPoseidon(msg, signature, pubKey));

    const input_C = {
        enabled: 1,
        Ax: F.toObject(pubKey[0]).toString(),
        Ay: F.toObject(pubKey[1]).toString(),
        R8x: F.toObject(signature.R8[0]).toString(),
        R8y: F.toObject(signature.R8[1]).toString(),
        S: signature.S.toString(),
        private_consumption: private_consumption,
        current_sum,
    };

    console.log(input_C);

    fs.writeFileSync("input_C.json", JSON.stringify(input_B, null, 4));
}

createInputs();

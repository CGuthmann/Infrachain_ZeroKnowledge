const buildEddsa = require("circomlibjs").buildEddsa;
const buildBabyjub = require("circomlibjs").buildBabyjub;
const chai = require("chai");

// require('json-bigint-patch');

const fs = require("fs");
const config = require("./config.json");
//console.log(config);

const input_A = require("./input_A.json");

async function createInputs() {

    const private_consumption = 5678;

    const eddsa = await buildEddsa();
    const babyJub = await buildBabyjub();
    const F = babyJub.F;
    const msg = F.e(private_consumption);

    const prvKey = Buffer.from(config.privateKey, "hex");

    const pubKey = eddsa.prv2pub(prvKey);
    console.log("Public key: " + pubKey);

    const signature = eddsa.signPoseidon(prvKey, msg);

    chai.assert(eddsa.verifyPoseidon(msg, signature, pubKey));

    const input_B = {
        enabled: 1,
        Ax: F.toObject(pubKey[0]).toString(),
        Ay: F.toObject(pubKey[1]).toString(),
        R8x: F.toObject(signature.R8[0]).toString(),
        R8y: F.toObject(signature.R8[1]).toString(),
        S: signature.S.toString(),
        private_consumption,
        current_sum: input_A.current_sum + input_A.private_consumption
    };

    console.log(input_B);

    fs.writeFileSync("input_B.json", JSON.stringify(input_B, null, 4));
}

createInputs();

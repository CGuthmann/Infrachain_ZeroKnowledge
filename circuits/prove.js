const snarkjs = require("snarkjs");
const fs = require("fs");

let inputs = require("./input_circuit_A.json");
console.log(inputs);

async function run() {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(inputs, "circuit_A_js/circuit_A.wasm", "circuit_A_0001.zkey");

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));

    const vKey = JSON.parse(fs.readFileSync("verification_key_circuit_A.json"));

    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }

    console.log(await snarkjs.groth16.exportSolidityCallData(proof, publicSignals));

}

run().then(() => {
    process.exit(0);
});
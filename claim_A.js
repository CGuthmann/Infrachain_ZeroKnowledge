'use strict';

const circuitName = "circuit_participant";

const fs = require("fs");
const config = require("./config.json")
const Web3 = require("web3");
const Contract = require("web3-eth-contract");
const TruffleContract = require("truffle-contract");
const provider = new Web3.providers.HttpProvider(config.node);
const web3 = new Web3(provider);
const snarkjs = require("snarkjs");
const BigNumber = require("bignumber.js");

const input_A_claim = require("./circuits/input_A_claim.json");

const account = config.account

function p256(n) {
	let nstr = new BigNumber(n).toString(16);
	while (nstr.length < 64) nstr = '0' + nstr;
	nstr = '0x' + nstr;
	return nstr;
}

// largely copied from https://raw.githubusercontent.com/iden3/snarkjs/0c0334179879cab4b3ce3eebb019462d8173f418/build/snarkjs.js
async function groth16ExportSolidityCallData(proof, pub) {
	let inputs = [];
	for (let i = 0; i < pub.length; i++) {
		if (inputs != [])
			inputs.push(p256(pub[i]));
	}

	let P;
	P = [[p256(proof.pi_a[0]), p256(proof.pi_a[1])],
	[[p256(proof.pi_b[0][1]), p256(proof.pi_b[0][0])], [p256(proof.pi_b[1][1]), p256(proof.pi_b[1][0])]],
	[p256(proof.pi_c[0]), p256(proof.pi_c[1])],
		inputs
	];
	return P;
}


async function main() {



	const { proof, publicSignals } = await snarkjs.groth16.fullProve(input_A_claim, "circuits/circuit_claim_js/circuit_claim.wasm", "circuits/circuit_claim_0001.zkey");

	// console.log("Proof: ");
	// console.log(JSON.stringify(proof, null, 1));

	console.log("Public: ");
	console.log(JSON.stringify(publicSignals, null, 1));

	const vKey = JSON.parse(fs.readFileSync("circuits/verification_key_circuit_claim.json"));

	const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

	if (res === true) {
		console.log("Verification OK");
	} else {
		console.log("Invalid proof");
	}

}

main();

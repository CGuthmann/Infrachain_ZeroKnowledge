/*
 * Copyright 2020  ChainLab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

const input_A = require("./circuits/input_A.json");
const input_B = require("./circuits/input_B.json");
const input_C = require("./circuits/input_C.json");
const input_total = require("./circuits/input_total.json")

const account = config.account;

const addressContract = Buffer.from(fs.readFileSync("testContractAddress")).toString();
console.log(addressContract);

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

	/*
	let contractTestRawdata = fs.readFileSync('build/contracts/testing.json');
	let contractTestMetadata = JSON.parse(contractTestRawdata);
	// console.log(metadata);

	const contractTest = new web3.eth.Contract(contractTestRawdata.abi);
	console.log(contractTest);
	*/

	const signer = await web3.eth.accounts.privateKeyToAccount("22aae6e36021acbf8d4a05a169d77919929d390dab212c609c319ea99c4dd298")
	console.log(account);
	web3.eth.accounts.wallet.add(signer);

	const artifact = require("./build/contracts/testing.json");

	console.log(artifact.abi);
	console.log(addressContract);

	const testContractInstance = new web3.eth.Contract(
		artifact.abi,
		addressContract
	)

	console.log(testContractInstance);

	const { proof, publicSignals } = await snarkjs.groth16.fullProve(input_total, "circuits/circuit_total_js/circuit_total.wasm", "circuits/circuit_total_0001.zkey");


	console.log("Public: ");
	console.log(JSON.stringify(publicSignals, null, 1));


	const vKey = JSON.parse(fs.readFileSync("circuits/verification_key_circuit_total.json"));

	const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

	if (res === true) {
		console.log("Verification OK");
	} else {
		console.log("Invalid proof");
	}
	
	let calldata = await groth16ExportSolidityCallData(proof, publicSignals);
	console.log(calldata);

	
	let response = await testContractInstance.methods.tst_total(calldata[0], calldata[1], calldata[2],
		 calldata[3]).send({
		from: config.account,
		gas: 4000000
	}).catch(err => {
		console.log(err);
	})

	console.log(response);
	
}

main();

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

	console.log(config.account);

	const signer = await web3.eth.accounts.privateKeyToAccount("22aae6e36021acbf8d4a05a169d77919929d390dab212c609c319ea99c4dd298")
	console.log(account);
	web3.eth.accounts.wallet.add(signer);

	const balance = await web3.eth.getBalance(config.account);
	console.log("balance", web3.utils.fromWei(balance, "ether"));

	let contractParticipantVerifierRawdata = fs.readFileSync('build/contracts/Verifier_circuit_participant.json');
	let contractParticipantVerifierMetadata = JSON.parse(contractParticipantVerifierRawdata);
	// console.log(metadata);

	const contractParticipantVerifier = new web3.eth.Contract(contractParticipantVerifierMetadata.abi);
	// console.log(contract);

	const contractParticipantVerifierSend = contractParticipantVerifier.deploy({
		data: contractParticipantVerifierMetadata.bytecode,
		arguments: []
	})

	const contractParticipantVerifierInstance = await contractParticipantVerifierSend.send({
		from: config.account,
		gas: 3500000
	})

	console.log(contractParticipantVerifierInstance._address);



	await new Promise(r => setTimeout(r, 15000));

	let contractTotalVerifierRawdata = fs.readFileSync('build/contracts/Verifier_circuit_total.json');
	let contractTotalVerifierMetadata = JSON.parse(contractTotalVerifierRawdata);
	// console.log(metadata);

	const contractTotalVerifier = new web3.eth.Contract(contractTotalVerifierMetadata.abi);
	// console.log(contract);

	const contractTotalVerifierSend = contractTotalVerifier.deploy({
		data: contractTotalVerifierMetadata.bytecode,
		arguments: []
	})

	console.log("Sending total verifier")
	const contractTotalVerifierInstance = await contractTotalVerifierSend.send({
		from: config.account,
		gas: 4000000
	})

	console.log(contractTotalVerifierInstance._address);

	



	//let calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
	let contractTestingRawdata = fs.readFileSync('build/contracts/testing.json');
	let contractTestingMetadata = JSON.parse(contractTestingRawdata);
	// console.log(metadata);

	const contractTesting = new web3.eth.Contract(contractTestingMetadata.abi);
	// console.log(contract);

	const contractTestingSend = contractTesting.deploy({
		data: contractTestingMetadata.bytecode,
		arguments: [contractParticipantVerifierInstance._address,
			contractTotalVerifierInstance._address,contractParticipantVerifierInstance._address]
	})

	const contractTestingInstance = await contractTestingSend.send({
		from: config.account,
		gas: 3500000
	})

	for (let inputs of [input_A, input_B, input_C]) {

		const { proof, publicSignals } = await snarkjs.groth16.fullProve(inputs, "circuits/circuit_participant_js/circuit_participant.wasm", "circuits/circuit_participant_0001.zkey");

		console.log("Proof: ");
		console.log(JSON.stringify(proof, null, 1));

		console.log("Public: ");
		console.log(JSON.stringify(publicSignals, null, 1));

		const vKey = JSON.parse(fs.readFileSync("circuits/verification_key_circuit_participant.json"));

		const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
		
		// console.log(newContractInstance);

		// fs.writeFileSync("./contractAddress", newContractInstance._address);

	

		console.log(contractTestingInstance._address);

		fs.writeFileSync("./testContractAddress", contractTestingInstance._address);
		
		let calldata = await groth16ExportSolidityCallData(proof, publicSignals);
		console.log(calldata);


		let response = await contractTestingInstance.methods.tst(calldata[0], calldata[1], calldata[2],
			calldata[3]).send({
			from: config.account,
			gas: 4000000
		}).catch(err => {
			console.log(err);
		})

		console.log(response);

		if (res === true) {
			console.log("Verification OK");
		} else {
			console.log("Invalid proof");
		}

	}

	
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

	
	let response = await contractTestingInstance.methods.tst_total(calldata[0], calldata[1], calldata[2],
		 calldata[3]).send({
		from: config.account,
		gas: 4000000
	}).catch(err => {
		console.log(err);
	})

	console.log(response);
	
	/*
	//let calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
	let rawdataNew = fs.readFileSync('build/contracts/testing.json');
	let metadataNew = JSON.parse(rawdataNew);
	// console.log(metadata);

	const contractNew = new web3.eth.Contract(metadataNew.abi);
	// console.log(contract);

	const contractSendNew = contractNew.deploy({
		data: metadataNew.bytecode,
		arguments: []
	})

	const newContractInstanceNew = await contractSendNew.send({
		from: config.account,
		gas: 3500000
	})

	console.log(newContractInstanceNew._address);
	
	let calldata = await groth16ExportSolidityCallData(proof, publicSignals);
	console.log(calldata);

	console.log(calldata[0]);
	console.log(calldata[1]);
	console.log(calldata[2]);
	console.log(calldata[3]);

	let response = await newContractInstancenew.methods.tst(calldata[0], calldata[1], calldata[2], calldata[3],newContractInstance._address).send({
		from: config.account,
		gas: 4000000
	}).catch(err => {
		console.log(err);
	})

	console.log(response);
	
*/
}

main();

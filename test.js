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

const input_A = require("./circuits/inputs_A.json");
const input_B = require("./circuits/inputs_B.json");
const input_C = require("./circuits/inputs_C.json");
const input_total = require("./circuits/inputs_total.json")

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

    let rawdata = fs.readFileSync('build/contracts/Verifier_Participants.json');
    let metadata = JSON.parse(rawdata);
    // console.log(metadata);

    const contract = new web3.eth.Contract(metadata.abi);
    // console.log(contract);

    const contractSend = contract.deploy({
        data: metadata.bytecode,
        arguments: []
    })

    const newContractInstance = await contractSend.send({
        from: config.account,
        gas: 1500000
    })

    console.log(newContractInstance._address);

	// console.log(newContractInstance);

	// fs.writeFileSync("./contractAddress", newContractInstance._address);

	for (let inputs in Enumerator([input_A, input_B, input_C])) {

	const { proof, publicSignals } = await snarkjs.groth16.fullProve(inputs, "circuits/circuit_participant_js/participant.wasm", "circuits/parcitipant_0001.zkey");

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));

	}

    const vKey = JSON.parse(fs.readFileSync("circuits/verification_key_" + circuitName + ".json"));

    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }

    // let calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);

	/*
	let calldata = await groth16ExportSolidityCallData(proof, publicSignals);
    console.log(calldata);

	console.log(calldata[0]);
	console.log(calldata[1]);
	console.log(calldata[2]);
	console.log(calldata[3]);

	let response = await newContractInstance.methods.verifyProof(calldata[0], calldata[1], calldata[2], calldata[3]).send({
		from: config.account,
		gas: 1000000
	}).catch(err => {
		console.log(err);
	})

	console.log(response);
	*/

}

main();

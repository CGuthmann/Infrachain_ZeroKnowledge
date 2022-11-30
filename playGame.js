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
const input_claimA = require("./circuits/input_A_claim.json")
const input_claimC = require("./circuits/input_claimC.json")


const account = config.account;

const accounts = require("./mock_addresses.json");
const contractAddresses = require("./contractAddresses.json");

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

function printState(state){
    let keys = Object.keys(state);
	console.log("{");
    for(let i = (keys.length / 2)+3; i < keys.length; i++){
        console.log(keys[i] + ": " + state[keys[i]])
    }
	console.log("}")
}

async function main() {

	/*
	let contractTestRawdata = fs.readFileSync('build/contracts/testing.json');
	let contractTestMetadata = JSON.parse(contractTestRawdata);
	// console.log(metadata);

	const contractTest = new web3.eth.Contract(contractTestRawdata.abi);
	console.log(contractTest);
	*/

	web3.eth.handleRevert = true;

	for (let acc of accounts) {

		let signer = await web3.eth.accounts.privateKeyToAccount(acc.privateKey)
		// console.log(acc);
		web3.eth.accounts.wallet.add(signer);

	}

	const artifactCollateralBet = require("./build/contracts/CollateralBet.json");

	// console.log(artifact.abi);
	// console.log(addressContract);

	const instanceCollateralBet = new web3.eth.Contract(
		artifactCollateralBet.abi,
		contractAddresses.collateralBet
	)

	const artifactCollateralToken = require("./build/contracts/CollateralToken.json");

	// console.log(artifact.abi);
	// console.log(addressContract);

	const instanceCollateralToken = new web3.eth.Contract(
		artifactCollateralToken.abi,
		contractAddresses.collateralToken
	)

	let response;

	console.log("Get state for game");
	response = await instanceCollateralBet.methods.state(0).call().catch(err => {
		console.log(err);
	})
	printState(response);

	let a_address = response.aAddress;
	let b_address = response.bAddress;
	let c_address = response.cAddress;


	response = await instanceCollateralToken.methods.balanceOf(a_address).call().catch(err => {
		console.log(err);
	})

	console.log("\nOld balance for A: " + response);

	await new Promise(r => setTimeout(r, 8000));
	
	// console.log(a_address);
	console.log("");

	let { proof, publicSignals } = await snarkjs.groth16.fullProve(input_A, "circuits/circuit_participant_js/circuit_participant.wasm", "circuits/circuit_participant_0001.zkey");


	console.log("Proof: ");
	console.log(JSON.stringify(proof, null, 2));

	console.log("Public: ");
	console.log(JSON.stringify(publicSignals, null, 2));


	await new Promise(r => setTimeout(r, 10000));

	let vKey = JSON.parse(fs.readFileSync("circuits/verification_key_circuit_participant.json"));

	let res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

	
	if (res === true) {
		console.log("Verification OK");
	} else {
		console.log("Invalid proof");
	}
	

	let calldata = await groth16ExportSolidityCallData(proof, publicSignals);
	// console.log(calldata);


	response = await instanceCollateralBet.methods.one(calldata[0], calldata[1], calldata[2],
		calldata[3]).send({
			from: a_address,
			gas: 4000000
		}).catch(err => {
			console.log(err);
		})

	// try { console.log(response.transactionHash) } catch (err) { }

	console.log("\n")

	console.log("Get state for game after stage one");
	response = await instanceCollateralBet.methods.state(0).call().catch(err => {
		console.log(err);
	})
	printState(response);


	await new Promise(r => setTimeout(r, 10000));


	{
		let { proof, publicSignals } = await snarkjs.groth16.fullProve(input_B, "circuits/circuit_participant_js/circuit_participant.wasm", "circuits/circuit_participant_0001.zkey");


		//console.log("Public: ");
		//console.log(JSON.stringify(publicSignals, null, 1));


		let vKey = JSON.parse(fs.readFileSync("circuits/verification_key_circuit_participant.json"));

		let res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

		/*
		if (res === true) {
			console.log("Verification OK");
		} else {
			console.log("Invalid proof");
		}
		*/

		let calldata = await groth16ExportSolidityCallData(proof, publicSignals);
		// console.log(calldata);


		response = await instanceCollateralBet.methods.two(calldata[0], calldata[1], calldata[2],
			calldata[3]).send({
				from: b_address,
				gas: 4000000
			}).catch(err => {
				console.log(err);
			})

		//try { console.log(response.transactionHash) } catch (err) { }

		console.log("\n");

		console.log("Get state for game after stage two");
		response = await instanceCollateralBet.methods.state(0).call().catch(err => {
			console.log(err);
		})
		printState(response);
	}

	await new Promise(r => setTimeout(r, 5000));

	{
		let { proof, publicSignals } = await snarkjs.groth16.fullProve(input_C, "circuits/circuit_participant_js/circuit_participant.wasm", "circuits/circuit_participant_0001.zkey");


		//console.log("Public: ");
		//console.log(JSON.stringify(publicSignals, null, 1));


		let vKey = JSON.parse(fs.readFileSync("circuits/verification_key_circuit_participant.json"));

		let res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

		/*
		if (res === true) {
			console.log("Verification OK");
		} else {
			console.log("Invalid proof");
		}
		*/

		let calldata = await groth16ExportSolidityCallData(proof, publicSignals);
		// console.log(calldata);


		response = await instanceCollateralBet.methods.three(calldata[0], calldata[1], calldata[2],
			calldata[3]).send({
				from: c_address,
				gas: 4000000
			}).catch(err => {
				console.log(err);
			})

		// try { console.log(response.transactionHash) } catch (err) { }

		console.log("\n");


		console.log("Get state for game after stage three");
		response = await instanceCollateralBet.methods.state(0).call().catch(err => {
			console.log(err);
		})
		printState(response);
	}

	await new Promise(r => setTimeout(r, 3000));

	{
		let { proof, publicSignals } = await snarkjs.groth16.fullProve(input_total, "circuits/circuit_total_js/circuit_total.wasm", "circuits/circuit_total_0001.zkey");


		// console.log("Public: ");
		// console.log(JSON.stringify(publicSignals, null, 1));


		let vKey = JSON.parse(fs.readFileSync("circuits/verification_key_circuit_total.json"));

		let res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

		/*
		if (res === true) {
			console.log("Verification OK");
		} else {
			console.log("Invalid proof");
		}
		*/

		let calldata = await groth16ExportSolidityCallData(proof, publicSignals);
		// console.log(calldata);


		response = await instanceCollateralBet.methods.four(calldata[0], calldata[1], calldata[2],
			calldata[3]).send({
				from: a_address,
				gas: 4000000
			}).catch(err => {
				console.log(err);
			})

		// try { console.log(response.transactionHash) } catch (err) { }


		console.log("\n");

		console.log("Get state for game after stage four");
		response = await instanceCollateralBet.methods.state(0).call().catch(err => {
			console.log(err);
		})
		printState(response);
	}

	await new Promise(r => setTimeout(r, 5000));
	
	{
		let { proof, publicSignals } = await snarkjs.groth16.fullProve(input_claimA, "circuits/circuit_claim_js/circuit_claim.wasm", "circuits/circuit_claim_0001.zkey");


		//console.log("Public: ");
		//console.log(JSON.stringify(publicSignals, null, 1));


		let vKey = JSON.parse(fs.readFileSync("circuits/verification_key_circuit_claim.json"));

		let res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

		/*
		if (res === true) {
			console.log("Verification OK");
		} else {
			console.log("Invalid proof");
		}
		*/

		let calldata = await groth16ExportSolidityCallData(proof, publicSignals);
		// console.log(calldata);


		response = await instanceCollateralBet.methods.five(calldata[0], calldata[1], calldata[2],
			calldata[3]).send({
				from: a_address,
				gas: 4000000
			}).catch(err => {
				console.log(err);
				console.log(err.message)
			})

		try { console.log(response.transactionHash) } catch (err) { }


		console.log("Get state for game after stage five");
		response = await instanceCollateralBet.methods.state(0).call().catch(err => {
			console.log(err);
		})
		printState(response);


		response = await instanceCollateralToken.methods.balanceOf(a_address).call().catch(err => {
			console.log(err);
		})

		console.log("\nNew balance for A: " + response);


		process.exit();

	}

}

main();

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
const provider = new Web3.providers.HttpProvider(config.node);
const web3 = new Web3(provider);

const contractAddresses = require("./contractAddresses.json");

const account = config.account

const accounts = require("./mock_addresses.json");

async function main() {

	// console.log(config.account);

	for (let acc of accounts) {

		let signer = await web3.eth.accounts.privateKeyToAccount(acc.privateKey)
		// console.log(acc);
		web3.eth.accounts.wallet.add(signer);

	}

	const artifactCollateralToken = require("./build/contracts/CollateralToken.json");

	// console.log(artifact.abi);
	// console.log(addressContract);

	const instanceCollateralToken = new web3.eth.Contract(
		artifactCollateralToken.abi,
		contractAddresses.collateralToken
	)

	let resp;
	let response;


	resp = await web3.eth.sendTransaction({ "from": accounts[2].address, "to": accounts[0].address, "value": 100000000000000000000, "gas": 4000000 })
	// console.log(resp);

	resp = await web3.eth.sendTransaction({ "from": accounts[3].address, "to": accounts[1].address, "value": 100000000000000000000, "gas": 4000000 })
	// console.log(resp);

	for (let acc of accounts) {

		let signer = await web3.eth.accounts.privateKeyToAccount(acc.privateKey)
		// console.log(acc);
		web3.eth.accounts.wallet.add(signer);

		let balance = await web3.eth.getBalance(acc.address);
		console.log("balance", web3.utils.fromWei(balance, "ether"));

	}

	console.log("Setting the minter");
	response = await instanceCollateralToken.methods.addMinter(contractAddresses.collateralBet).send({
		from: config.account,
		gas: 4000000
	}).catch(err => {
		console.log(err);
	})

	console.log(response);
	try {
		console.log(response.events.RoleGranted.returnValues);
	} catch (err) { }


	console.log("Setting the burner");
	response = await instanceCollateralToken.methods.addBurner(contractAddresses.collateralBet).send({
		from: config.account,
		gas: 4000000
	}).catch(err => {
		console.log(err);
	})

	console.log(response);
	try {
		console.log(response.events.RoleGranted.returnValues);
	} catch (err) { }

	const artifactCollateralBet = require("./build/contracts/CollateralBet.json");

	// console.log(artifact.abi);
	// console.log(addressContract);

	const instanceCollateralBet = new web3.eth.Contract(
		artifactCollateralBet.abi,
		contractAddresses.collateralBet
	)

	console.log("Token address in Bet contract");
	response = await instanceCollateralBet.methods.tokenAddress().call().catch(err => {
		console.log(err);
	})
	console.log(response);



	console.log("Mint for addresses");

	for (let acc of accounts) {
		console.log(acc.address);
		let response = await instanceCollateralToken.methods.mint(acc.address, 1).send({
			from: account,
			gas: 4000000
		}).catch(err => {
			console.log(err);
		})

		console.log(response)
		console.log(response.events.Transfer.returnValues);


		console.log("New balance");
		response = await instanceCollateralToken.methods.balanceOf(acc.address).call().catch(err => {
			console.log(err);
		})

		console.log("");
		console.log(response);
		console.log("");

		console.log("Approvals");
		response = await instanceCollateralToken.methods.approve(contractAddresses.collateralBet, 1).send({
			from: acc.address,
			gas: 4000000
		}).catch(err => {
			console.log(err);
		})

		console.log(response);
		console.log(response.events.Approval.returnValues);


		console.log("Registration");
		response = await instanceCollateralBet.methods.deposit(1).send({
			from: acc.address,
			gas: 4000000
		}).catch(err => {
			console.log(err);
		})

		console.log(response);
		try {
			console.log(response.event.Transfer.returnValues);
		} catch (err) {}
	}



	console.log("Get registered participants");
	response = await instanceCollateralBet.methods.registeredParticipants(1).call().catch(err => {
		console.log(err);
	})

	console.log(response);


	/*
	console.log("New balance");
	response = await instanceCollateralToken.methods.balanceOf(config.account).call().catch(err => {
		console.log(err);
	})
	
	console.log(response)
	*/

	// console.log(response);


	console.log("Starting the game");
	response = await instanceCollateralBet.methods.startByOwner().send({
		from: config.account,
		gas: 4000000
	}).catch(err => {
		console.log(err);
	})

	console.log(response);



	process.exit(0);



}

main();

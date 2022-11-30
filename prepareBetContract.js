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
for (acc of accounts) {
	console.log(acc.address);
}

async function main() {

	console.log(config.account);

	const signer = await web3.eth.accounts.privateKeyToAccount("22aae6e36021acbf8d4a05a169d77919929d390dab212c609c319ea99c4dd298")
	console.log(account);
	web3.eth.accounts.wallet.add(signer);

	const balance = await web3.eth.getBalance(config.account);
	console.log("balance", web3.utils.fromWei(balance, "ether"));

	let contractCollateralTokenRawData = fs.readFileSync('build/contracts/CollateralToken.json');
	let contractCollateralTokenMetaData = JSON.parse(contractCollateralTokenRawData);
	// console.log(metadata);

	const artifact = require("./build/contracts/collateralToken.json");

	// console.log(artifact.abi);
	// console.log(addressContract);

	const instanceCollateralBet = new web3.eth.Contract(
		artifact.abi,
		contractAddresses.collateralToken
	)

	console.log("Setting the minter");
	let response = await instanceCollateralBet.methods.addMinter(contractAddresses.collateralBet).send({
			from: config.account,
			gas: 4000000
		}).catch(err => {
			console.log(err);
		})

	console.log(response);

	console.log("Setting the burner");
	response = await instanceCollateralBet.methods.addBurner(contractAddresses.collateralBet).send({
		from: config.account,
		gas: 4000000
	}).catch(err => {
		console.log(err);
	})

	console.log(response);

	console.log("Mint for addresses");
	response = await instanceCollateralBet.methods.mint(config.account, 1).send({
		from: config.account,
		gas: 4000000
	}).catch(err => {
		console.log(err);
	})


	process.exit(0);



}

main();

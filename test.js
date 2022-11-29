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

const fs = require("fs");
const config = require("./config.json")
const Web3 = require("web3");
const Contract = require("web3-eth-contract");
const TruffleContract = require("truffle-contract");
const provider = new Web3.providers.HttpProvider(config.node);
const web3 = new Web3(provider);

const account = config.account

const artifact = require("./build/contracts/HelloWorld.json");

async function main(){

	console.log(config.account);

	console.log(await web3.eth.accounts.privateKeyToAccount("22aae6e36021acbf8d4a05a169d77919929d390dab212c609c319ea99c4dd298"));

	const accounts = await web3.eth.getAccounts();
	console.log(accounts);

	const balance = await web3.eth.getBalance(config.account);
    console.log("balance", web3.utils.fromWei(balance, "ether"));

	let rawdata = fs.readFileSync('build/contracts/HelloWorld.json');
    let metadata = JSON.parse(rawdata);
	//console.log(metadata);

	const contract = new web3.eth.Contract(metadata.abi);
	//console.log(contract);

	const contractSend = contract.deploy({
        data: metadata.bytecode,
        arguments: []
    })

	const newContractInstance = await contractSend.send({
        from:  config.account,
        gas: 1500000
    })

	console.log(newContractInstance);


}

/*

const instance = new web3.eth.Contract(artifact.abi, artifact.networks['10'].address);
//console.log(artifact.networks['10'].address);

async function createPrescription(id) {

	let adminAccount = await web3.eth.getAccounts().catch(err => {
		console.log(err);
	});
	//console.log("Admin account: " + adminAccount);

	let patientAccount = await web3.eth.accounts.create("Hallo");
	let prescriptionPrivateKey = patientAccount.privateKey;
	//console.log("Patient Account: " + patientAccount.address);
	//console.log("Patient Account private key: " + patientAccount.privateKey);
	//console.log(typeof(patientAccount.address));
	//console.log(typeof(adminAccount));
	let returnValue = await instance.methods.create(patientAccount.address, id).send({
		from: adminAccount.toString(),
		gas: 300000
	}).catch(err => {return Promise.reject(err)});
	//console.log(returnValue);
        console.log(prescriptionPrivateKey);
	return;
};
*/


main();

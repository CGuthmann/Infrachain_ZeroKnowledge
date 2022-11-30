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


const account = config.account
const delay = 15

const ParticipantAddress = '0x755284B1aB5Ce65E1b71F019eeF74B68CDeebf4f';
const TotalVerifierAddress = '0x1376AC2b971964dBB14fEE84b4B340F6E00fA901';
const ClaimVerifierAddress = '0x92cfD520Fef2C95E22CC702e700f50f4Bb8747DB';
const CollateralTokenAddress = '0xD553b1500237d659C3aCaa2a72B039ecaf335C40';


async function main() {

	console.log(config.account);

    const contractAddresses = {};


	const signer = await web3.eth.accounts.privateKeyToAccount("22aae6e36021acbf8d4a05a169d77919929d390dab212c609c319ea99c4dd298")
	web3.eth.accounts.wallet.add(signer);

	const balance = await web3.eth.getBalance(config.account);
	console.log("balance", web3.utils.fromWei(balance, "ether"));

    let contractParticipantVerifierInstance;
    if(ParticipantAddress == ''){
	let contractParticipantVerifierRawdata = fs.readFileSync('build/contracts/Verifier_circuit_participant.json');
	let contractParticipantVerifierMetadata = JSON.parse(contractParticipantVerifierRawdata);
	// console.log(metadata);

	const contractParticipantVerifier = new web3.eth.Contract(contractParticipantVerifierMetadata.abi);
	// console.log(contract);

	const contractParticipantVerifierSend = contractParticipantVerifier.deploy({
		data: contractParticipantVerifierMetadata.bytecode,
		arguments: []
	})

	contractParticipantVerifierInstance = await contractParticipantVerifierSend.send({
		from: config.account,
		gas: 3500000
	})

	await new Promise(r => setTimeout(r, delay));
    }else {
        const artifact = require("./build/contracts/Verifier_circuit_participant.json");

        contractParticipantVerifierInstance = await new web3.eth.Contract(
            artifact.abi,
            ParticipantAddress
        )
    }

	console.log("ParticipantVerifier deployed at: ",contractParticipantVerifierInstance._address);





    let contractTotalVerifierInstance;
    if(TotalVerifierAddress == ''){
        let contractTotalVerifierRawdata = fs.readFileSync('build/contracts/Verifier_circuit_total.json');
        let contractTotalVerifierMetadata = JSON.parse(contractTotalVerifierRawdata);
        // console.log(metadata);

        const contractTotalVerifier = new web3.eth.Contract(contractTotalVerifierMetadata.abi);
        // console.log(contract);

        const contractTotalVerifierSend = contractTotalVerifier.deploy({
            data: contractTotalVerifierMetadata.bytecode,
            arguments: []
        })

        contractTotalVerifierInstance = await contractTotalVerifierSend.send({
            from: config.account,
            gas: 4000005
        })

        

        await new Promise(r => setTimeout(r, delay));
    }else {
        const artifact = require("./build/contracts/Verifier_circuit_total.json");

        contractTotalVerifierInstance = new web3.eth.Contract(
            artifact.abi,
            ParticipantAddress
        )
    }

    console.log("TotalVerifier deployed at: ",contractTotalVerifierInstance._address);





	
    let contractClaimVerifierInstance;
    if(ClaimVerifierAddress == '')
    {
        let contractClaimVerifierRawdata = fs.readFileSync('build/contracts/Verifier_circuit_claim.json');
        let contractClaimVerifierMetadata = JSON.parse(contractClaimVerifierRawdata);
        // console.log(metadata);

        const contractClaimVerifier = new web3.eth.Contract(contractClaimVerifierMetadata.abi);
        // console.log(contract);

        const contractClaimVerifierSend = contractClaimVerifier.deploy({
            data: contractClaimVerifierMetadata.bytecode,
            arguments: []
        })

        contractClaimVerifierInstance = await contractClaimVerifierSend.send({
            from: config.account,
            gas: 4000005
        })



        await new Promise(r => setTimeout(r, delay));
    }else {
        const artifact = require("./build/contracts/Verifier_circuit_claim.json");

        contractClaimVerifierInstance = new web3.eth.Contract(
            artifact.abi,
            ParticipantAddress
        )
    }

    console.log("ClaimVerifier deployed at: ",contractClaimVerifierInstance._address);



	
    let contractCollateralTokenInstance;
    if(CollateralTokenAddress == '')
    {    
        let contractCollateralTokenRawdata = fs.readFileSync('build/contracts/CollateralToken.json');
        let contractCollateralTokenMetadata = JSON.parse(contractCollateralTokenRawdata);
        // console.log(metadata);

        const contractCollateralToken = new web3.eth.Contract(contractCollateralTokenMetadata.abi);
        // console.log(contract);

        const contractCollateralTokenSend = contractCollateralToken.deploy({
            data: contractCollateralTokenMetadata.bytecode,
            arguments: []
        })

        contractCollateralTokenInstance = await contractCollateralTokenSend.send({
            from: config.account,
            gas: 4000005
        })



        await new Promise(r => setTimeout(r, delay));
    }else {
        const artifact = require("./build/contracts/CollateralToken.json");

        contractParticipantVerifierInstance = new web3.eth.Contract(
            artifact.abi,
            ParticipantAddress
        )
    }
    console.log("CollateralToken deployed at: ",contractCollateralTokenInstance._address);
    contractAddresses.collateralToken = contractCollateralTokenInstance._address;



	//let calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
	let contractCollateralBetRawdata = fs.readFileSync('build/contracts/CollateralBet.json');
	let contractCollateralBetMetadata = JSON.parse(contractCollateralBetRawdata);
	// console.log(metadata);

	const contractCollateralBet = new web3.eth.Contract(contractCollateralBetMetadata.abi);
	// console.log(contract);

	const contractCollateralBetSend = contractCollateralBet.deploy({
		data: contractCollateralBetMetadata.bytecode,
		arguments: [contractCollateralTokenInstance._address,contractParticipantVerifierInstance._address,
			contractTotalVerifierInstance._address,contractClaimVerifierInstance._address]
	})

	const contractCollateralBetInstance = await contractCollateralBetSend.send({
		from: config.account,
		gas: 3500000
	})
    console.log("MainVerifier deployed at: ",contractCollateralBetInstance._address);

    contractAddresses.collateralBet = contractCollateralBetInstance._address;

    fs.writeFileSync("./contractAddress",JSON.stringify(contractAddresses));
	
}

main();

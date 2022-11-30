# Team ZeroKnowledge: Blockchain- and Cryptography-based gamification to reduce energy consumption

## General motivation

Today, a lot of data related to energy consumption is collected, but it is hardly used beyond billing although it is well-known that gamification elements that make use of consumption data can make consumers save energy. We see two key reasons for the lack of use of energy consumption-related data: 

(1) Different sectors are hardly collected, so the data cannot be used across different suppliers
(2) Consumers are hesitant to share their consumption data with third parties because the are afraid that this may compromise their privacy.

We solve these problems and, therefore, showcase how to enable the use of energy-related data by consumers without them needing to disclose sensitive information to third parties.

By using a blockchain as a neutral, modular, and non-discriminatory public digital infratructure for interacting with other players, we facilitate an ecosystem of game developers and incentives to participate in games and save electricity. Yet, using a blockchain even aggravates privacy-related issues. 



## Initial deployment
To run the demo, several dependencies must be installed: 
- For backend and frontend in general: 
    - node
    - truffle (as global npm package)

- For running the public sector blockchain testnet: 
    - docker
    - docker-compose

- For generating zero-knowledge proofs and related smart contract verifiers
    - rust
    - circom

These dependencies can be installed via ```bootstrap.sh``` on Ubuntu. Also, ```npm install``` must be run in both the main folder and the circuits folder.


## Bootstrapping the smart contracts

In total, 5 different smart contracts will be deployed:

- 3 smart contract verifiers for zero-knowledge proofs, corresponding to the different steps of the multi-party computation of the average and claiming rewards
- one ERC20 token contract for the incentives and deposits (CollateralToken)
- one contract that users directly interact with to play the game (CollateralBet) 

Before the smart contract verifiers for zero-knowledge proofs can be deployed, a trusted setup must be executed. We simulate this locally for the demo. The startup of the public sector blockchain and the subsequent deployment of all smart contracts can be started via ```node deploy.js``` 

## Playing the game in the cli

We can test the deployment by running a game where all three participants are controlled locally by running ```node prepareBetContract.js```. This will 
- Connect the ERC20 token with the main contract for the game
- Initialize the three players with some Ether to pay for the transaction fees
- Supply the three players with one token so they can register
- Unlocking the token to be controlled by the BetContract
- Finally register the three players. 

Once a player registers and the time is such that the game is supposed to start, the smart contract will automatically randomly assign groups of three players (potentially kicking two players out). After that, the five stages of the game will be sequentially executed: 

- aa

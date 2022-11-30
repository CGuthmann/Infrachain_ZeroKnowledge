# Team ZeroKnowledge: Blockchain- and Cryptography-based gamification to reduce energy consumption

## General motivation

Today, a lot of data related to energy consumption is collected, but it is hardly used beyond billing although it is well-known that gamification elements that make use of consumption data can make consumers save energy. We see two key reasons for the lack of use of energy consumption-related data: 

(1) Different sectors are hardly collected, so the data cannot be used across different suppliers
(2) Consumers are hesitant to share their consumption data with third parties because they are afraid that this may compromise their privacy.

It is therefore essential to first address these problems by creating a secure infrastructure, so data can be used in a privacy and interoperable way. In a second step, building on the infrastructure, the data can be put to use for increasing energy efficiency.

By using a blockchain as a neutral, modular, and non-discriminatory public digital infratructure for interacting with other players, we facilitate an ecosystem of game developers and incentives to participate in games and save electricity. Yet, using a blockchain even aggravates privacy-related issues. Performing privacy-preserving computations on data in a blockchain is not possible without additional solutions, because data inputs must be revealed to achieve determinism. 
To prevent this issue we make use of a cryptographic technique called "secure multi-party computation". It allows us to perform computations for the calculation of a public output for a group of unknown participants witout the need to reveal their private inputs. Yet, multi-party computation is not an ideal tool because it is only secure against semi-honest participants. Meaning that it is not ensured that participants did not cheat while performing the computaton. 
To circumvent this limitation, we employ an additional cryptographic technique called "Zero-knowledge proof". A Zero-Knowledge proof provides a proof for a computational integrity statement without revealing any information besides that the statement is true. With these proofs, it is now possible to check if a computation was performed according to the protocols rules in a simlar privacy-preserving manner. 

Equipped with these three integral parts of our approach (blockchain, multi-party computation, and Zero-Knowledge proofs), we solve these problems and build our secure and interoperable infrastructure. On this basis, we implement a popular game-theoretic approach called "serious games". Serious games nudge and incentivize individuals to perform desirable actions by game elements. In our implementation individuals are incentivized by a token reward to competitively reduce energy consumption. This game-theoretic approach is desireable over a top-down approach due to efficiency and effectiveness reasons. Firstly, the individuals can determine themselves which part of their energy consumpton is valued the most and which the least (and thus can get minimized). Secondly, because it avoids costly regulation efforts by the public sector.

Therefore, we showcase how to enable the use of energy-related data by consumers without them needing to disclose sensitive information to third parties.

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

# Team ZeroKnowledge: Gamification for reduced energy consumption

## General motivation

Today, a lot of data related to energy consumption is collected already, but it is hardly used beyond billing although it is well-known that there are many ways to utilize this data. For instance, gamification elements that make use of consumption data to incentivize consumers to save energy are rarely used. We see two key reasons for the lack of use of energy consumption-related data: 

1) Different sectors and even public and private institutions within a sector are not connected, so the data is locked in different silos, remaining rarely used.
2) Consumers are hesitant to share their sensitive data, such as electricity consumption data, with third parties because they are afraid that this may compromise their privacy.

We address these problems by creating a neutral and secure infrastructure on which consumption data can be used in a privacy-preserving and interoperable way. In particular, we implemented a showcase to increase energy efficiency among citizens and public and private institutions. Our use case compares the electricity consumption of groups of three individuals in a certain timeframe (e.g., a week) and rewards the ones who consumed less electricity than the average with tokens. These tokens can later on be redeemed or further used at any party that integrates with the public sector blockchain. 

By using a blockchain as a neutral, modular, and non-discriminatory public digital infratructure for interacting with other players, we facilitate an ecosystem of game developers and incentives to participate in games and save electricity. Yet, using a blockchain even aggravates the privacy-related issues of today's silos. We hence perform privacy-preserving computations on data in a blockchain, such that a winner can be determined without users ever sharing their sensitive consumption data with any other party. 
To implement this, we combine two cryptographic techniques:

*Multi-party computation*. It allows us to perform computations for the calculation of a public output for a group of unknown participants witout the need to reveal their private inputs. Yet, multi-party computation is not an ideal tool because it is only secure against semi-honest participants. Meaning that it is not ensured that participants did not cheat while performing the computaton. 

To circumvent this limitation, we employ an additional cryptographic technique called *zero-knowledge proofs*. A zero-knowledge proof provides a proof for a computational integrity statement without revealing any information besides that the statement is true. With these proofs, it is now possible to check if a computation was performed according to the protocols rules, without revealing any sensitive inputs, intermediary results, and outputs of the computation.

Equipped with these three integral parts of our approach (blockchain, multi-party computation, and zero-knowledge proofs), we solve these problems and build our secure and interoperable infrastructure. On this basis, we implement a popular game-theoretic approach called "serious games". Serious games nudge and incentivize individuals to perform desirable actions by game elements. In our implementation,individuals are incentivized by a token reward to competitively reduce energy consumption. This game-theoretic approach has several advantages over a top-down approach in terms of efficiency and effectiveness. For instance, the individuals can determine themselves which part of their energy consumpton is valued the most and which the least (and thus can get minimized). Secondly, because it avoids costly regulation efforts by the public sector.

Therefore, we showcase how to enable the use of energy-related data by consumers without them needing to disclose sensitive information to third parties.

## Initial deployment
To run the demo, several dependencies must be installed: 
- For backend and frontend in general: 
    - node (for instance, installation via nvm): 
        - ```curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash```
        - ```nvm install 18```
    - truffle (as global npm package): ```npm i truffle -g```

- For running the public sector blockchain testnet: 
    - docker 
    - docker-compose

- For generating zero-knowledge proofs and related smart contract verifiers
    - rust
    - circom

These dependencies can be installed via ```bootstrap.sh``` on Ubuntu. It also installs the npm packages where required.


## Bootstrapping the smart contracts

In total, 5 different smart contracts will be deployed:

- 3 smart contract verifiers for zero-knowledge proofs, corresponding to the different steps of the multi-party computation of the average and claiming rewards
- one ERC20 token contract for the incentives and deposits (CollateralToken)
- one contract that users directly interact with to play the game (CollateralBet) 

Before the smart contract verifiers for zero-knowledge proofs can be deployed, a trusted setup must be executed. We simulate this locally for the demo. The startup of the public sector blockchain and the subsequent deployment of all smart contracts can be started via ```run.sh``` 

## Simulating the full game in the cli

We can test the deployment by running a game where all three participants are controlled locally by running ```node prepareBetContract.js```. This will 
- Connect the ERC20 token with the main contract for the game
- Initialize the three players with some Ether to pay for the transaction fees
- Supply the three players with one token so they can register
- Unlock the token to be controlled by the BetContract
- Register the three players for the game

Once a player registers and the time is such that the game is supposed to start, the smart contract will automatically randomly assign groups of three players (potentially kicking two players out). After that, the five stages of the game can be sequentially executed via running ```node playGame.js```: 

- A sends its data in obfuscated way and a zero-knowledge proof that it complied with the protocol
- B, C do the same
- A completes the multi-party computation, so the average consumption is visible on the blockchain for all participants
- Every user whose electricity consumption is lower than this average can claim their reward.

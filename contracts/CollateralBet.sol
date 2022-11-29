// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.13 and less than 0.9.0
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

interface Verifier_circuit_participants{//A->B B->C C->A check the consumption "with the shift"
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) external view returns (bool r);
}

interface Verifier_circuit_total{//A->End
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) external view returns (bool r);
}


interface Verifier_circuit_claim{//All the winners,
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) external view returns (bool r);
}

contract CollateralBet is Ownable {
    ERC20Burnable private ERC20BurnableInterface;
    address public tokenAddress;
    address[] public registeredParticipants;

    //EPOCH HANDLING
    uint256 public epochTimestamp;

    function updateEpochTimestamp() internal {
        epochTimestamp = block.timestamp;
    }

    modifier onlyIfEpochEnded() {
        if (block.timestamp - epochTimestamp >= 1 weeks) {
            updateEpochTimestamp();
            _;
        }
    }

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress; //TODO: better have additional checks
        ERC20BurnableInterface = ERC20Burnable(tokenAddress);
        updateEpochTimestamp();
    }

    function getContractBalance() public view returns (uint256) {
        //TODO: make it private later
        return ERC20BurnableInterface.balanceOf(address(this));
    }

    //TODO: execute approve @FUND_OWNER@, @THIS_CONTRACT_ADDRESS@ before transferFrom(...)
    function deposit(uint256 _amount) public payable {
        uint256 _requiredAmount = 1;
        require(_amount == _requiredAmount, "Amount is not equal to 1"); // the smart contract
        ERC20BurnableInterface.transferFrom(msg.sender, address(this), _amount);

        register(msg.sender);
        _start();
    }

    function register(address _participantAddress) internal {
        registeredParticipants.push(_participantAddress);
    }

    function startByOwner() public onlyOwner {
        _start();
    }

    function _start() internal onlyIfEpochEnded {
        require(
            registeredParticipants.length > 0,
            "Number of participants is 0"
        );
        burnTokens();
        address[] memory shuffeledArray = shuffleArray(registeredParticipants);
        delete registeredParticipants;
        address[] memory processedArray = processArray(shuffeledArray);

        performMPCs(processedArray);
    }

    function processArray(address[] memory _unprocessedArray)
    internal
    returns (address[] memory)
    {
        uint256 length = _unprocessedArray.length;
        uint256 residuum = length % 3;
        if (residuum != 0) {
            for (uint256 i = length - 1; i < length - residuum; i--) {
                // mintTokens(_unprocessedArray[i], 1);
                delete _unprocessedArray[i];
            }
        }
        return _unprocessedArray;
    }

    function performMPCs(address[] memory _processedArrayOfParticipants) internal {
        for(uint256 i=0; i<_processedArrayOfParticipants.length-2;i=i+3){
            performSingleMPC(_processedArrayOfParticipants[i],
                _processedArrayOfParticipants[i+1],
                _processedArrayOfParticipants[i+2]
            );
        }
    }

    //TODO: getter for each stage for the UI


    function performSingleMPC(address A, address B, address C) internal{

    }


    function burnTokens() internal {
        ERC20BurnableInterface.burn(ERC20BurnableInterface.balanceOf(address(this)));
    }

    /*
    function mintTokens(address _playerAddress, uint256 _numberOfTokens)
    internal
    {
        ERC20BurnableInterface.mint(_playerAddress, _numberOfTokens);
    }
    */

    function shuffleArray(address[] storage shuffle)
    internal
    returns (address[] memory)
    {
        uint256 entropy = block.timestamp;

        for (uint256 i = shuffle.length - 1; i > 0; i--) {
            uint256 swapIndex = entropy % (shuffle.length - i);
            address currentIndex = shuffle[i];
            address indexToSwap = shuffle[swapIndex];
            shuffle[i] = indexToSwap;
            shuffle[swapIndex] = currentIndex;
        }

        return shuffle;
    }
}
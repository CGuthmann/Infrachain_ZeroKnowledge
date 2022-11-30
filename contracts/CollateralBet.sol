// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.13 and less than 0.9.0
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./CollateralToken.sol";

interface Verifier_circuit_participants {
    //A->B B->C C->A check the consumption "with the shift"
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input
    ) external view returns (bool r);
}

interface Verifier_circuit_total {
    //A->End
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[4] memory input
    ) external view returns (bool r);
}

interface Verifier_circuit_claim {
    //All the winners,
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) external view returns (bool r);
}

contract CollateralBet is Ownable {
    CollateralToken private ERC20BurnableInterface;
    address public tokenAddress;

    enum Stage {
        Zero,
        One,
        Two,
        Three,
        Four,
        Five
    }

    struct Container {
        address aAddress;
        address bAddress;
        address cAddress;
        Stage stage;
        uint256 comA;
        uint256 comR;
        uint256 comB; 
        uint256 comC;
        uint256 comRA;
        uint256 comRAB;
        uint256 comRABC;
        uint256 total;
    }

    Container[] public state;

    mapping(address => uint256) public addressToState;

    Verifier_circuit_participants verifierCircuitParticipantsInterface;
    Verifier_circuit_total verifierCircuitTotalInterface;
    Verifier_circuit_claim verifierCircuitClaimInterface;

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

    constructor(
        address _tokenAddress,
        address verifierCircuitParticipantsContract,
        address verifierCircuitTotalContract,
        address verifierCircuitClaimContract
    ) {
        tokenAddress = _tokenAddress;
        ERC20BurnableInterface = CollateralToken(tokenAddress);
        updateEpochTimestamp();

        verifierCircuitParticipantsInterface = Verifier_circuit_participants(
            verifierCircuitParticipantsContract
        );
        verifierCircuitTotalInterface = Verifier_circuit_total(
            verifierCircuitTotalContract
        );
        verifierCircuitClaimInterface = Verifier_circuit_claim(
            verifierCircuitClaimContract
        );
    }

    function getContractBalance() public view returns (uint256) {
        return ERC20BurnableInterface.balanceOf(address(this));
    }

    function deposit(uint256 _amount) public payable returns (uint256) {
        uint256 _requiredAmount = 1;
        require(_amount == _requiredAmount, "Amount is not equal to 1"); // the smart contract
        ERC20BurnableInterface.transferFrom(msg.sender, address(this), _amount);

        register(msg.sender);
        //_start();
        return 1;
    }

    address[] public registeredParticipants;
    mapping(address => bool) isRegistered;

    function register(address _participantAddress) internal {
        if (isRegistered[_participantAddress] == false) {
            registeredParticipants.push(_participantAddress);
            isRegistered[_participantAddress] = true;
        }
    }

    function clearRegistration() internal {
        for (uint256 i = 0; i < registeredParticipants.length; i++) {
            isRegistered[registeredParticipants[i]] = false;
        }
        delete registeredParticipants;
    }


    function startByOwner() public onlyOwner {
        _start();
    }

    function _start() internal {
        require(
            registeredParticipants.length > 0,
            "Number of participants is 0"
        );
        resetState();
        burnTokens();
        address[] memory shuffeledArray = shuffleArray(registeredParticipants);
        clearRegistration();
        address[] memory processedArray = processArray(shuffeledArray);

        performMPCs(processedArray);
    }

    function processArray(address[] memory _unprocessedArray)
    internal
    returns (address[] memory)
    {
        uint256 length = _unprocessedArray.length;
        uint256 residuum = length % 3;
        for (uint256 i = length - residuum; i < length; i++) {
            mintTokens(_unprocessedArray[i], 1);
            delete _unprocessedArray[i];
        }
        return _unprocessedArray;
    }

    function performMPCs(address[] memory _processedArrayOfParticipants)
    internal
    {
        for (
            uint256 i = 0;
            i < _processedArrayOfParticipants.length - 2;
            i = i + 3
        ) {
            performSingleMPC(
                _processedArrayOfParticipants[i],
                _processedArrayOfParticipants[i + 1],
                _processedArrayOfParticipants[i + 2]
            );
        }
    }

    function performSingleMPC(
        address aAddress,
        address bAddress,
        address cAddress
    ) internal {
        // uint balance[3] = [1, 2, 3];
        //   uint[3] memory c = [uint(1) , 2, 3];

        Container memory container = Container(
            aAddress,
            bAddress,
            cAddress,
            Stage.Zero,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );

        state.push(container);
        uint256 index = state.length - 1;
        addressToState[aAddress] = index;
        addressToState[bAddress] = index;
        addressToState[cAddress] = index;
    }

    function one(
        // encrypted value
        uint256[2] memory a, 
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input) external{
            uint index = addressToState[msg.sender];

            require(state[index].stage == Stage.Zero, "Game is not in stage 0 (it is not A's turn)");
            require(state[index].aAddress == msg.sender, "Sender is not role A");
            require(verifierCircuitParticipantsInterface.verifyProof(a, b, c, input), "Proof invalid");

            state[index].comA = input[0];
            state[index].comR = input[1];
            state[index].comRA = input[2];
            // set encrypted value

            state[index].stage = Stage.One;
        }


    function two(
        // encrypted value
        uint256[2] memory a, 
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input
    ) external {
            uint index = addressToState[msg.sender];

            require(state[index].stage == Stage.One, "Game is not in stage 1 (it is not B's turn)");
            require(state[index].bAddress == msg.sender, "Sender is not role B");
            require(input[1] == state[index].comRA, "B is not adding to A's value");
            require(verifierCircuitParticipantsInterface.verifyProof(a, b, c, input), "Proof invalid");

            state[index].comB = input[0];
            state[index].comRAB = input[2];
            // set encrypted value     

            state[index].stage = Stage.Two;
    }

    function three(
        // encrypted value
        uint256[2] memory a, 
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input) external 
    {
            uint index = addressToState[msg.sender];

            require(state[index].stage == Stage.Two, "Game is not in stage 2 (it is not C's turn)");
            require(state[index].cAddress == msg.sender, "Sender is not role C");
            require(input[1] == state[index].comRAB, "C is not adding to B's value");
            require(verifierCircuitParticipantsInterface.verifyProof(a, b, c, input), "Proof invalid");

            state[index].comC = input[0];
            state[index].comRABC = input[2];
            // set encrypted value    

            state[index].stage = Stage.Three;
    }

    function four(
        uint256[2] memory a, 
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[4] memory input) external {
            uint index = addressToState[msg.sender];

            require(state[index].stage == Stage.Three, "Game is not in stage 3 (it is not A's second turn)");
            require(state[index].aAddress == msg.sender, "Sender is not role A");
            require(input[0] == state[index].comA, "C is not adding to B's value");
            require(input[1] == state[index].comRABC, "C is not adding to B's value");
            require(input[2] == state[index].comRA, "C is not adding to B's value");
            require(verifierCircuitTotalInterface.verifyProof(a, b, c, input), "Proof invalid");

            state[index].total = input[3];
            // set encrypted value    

            state[index].stage = Stage.Four;

            mintTokens(state[index].aAddress, 1);
            mintTokens(state[index].bAddress, 1);
            mintTokens(state[index].cAddress, 1);
    }

    function five(
        uint256[2] memory a, 
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) external {
        require(msg.sender != address(0), "Transition fro 0 not allowed");
        uint index = addressToState[msg.sender];
        require(state[index].stage == Stage.Four, "Game is not in stage 4 (the mpc is not completed)");
        require(state[index].total == input[1]);
        if(msg.sender == state[index].aAddress){
            require(state[index].comA == input[0]);
            addressToState[state[index].aAddress] = 0;
            state[index].aAddress = address(0);
        }
        else if(msg.sender == state[index].bAddress){
            require(state[index].comB == input[0]);
            addressToState[state[index].bAddress] = 0;
            state[index].bAddress = address(0);
        }
        else if(msg.sender == state[index].cAddress){
            require(state[index].comC == input[0]);
            addressToState[state[index].cAddress] = 0;
            state[index].cAddress = address(0);
        }

        require(verifierCircuitClaimInterface.verifyProof(a, b, c, input),"Proof invalid");

        mintTokens(msg.sender, 10);        
    }

    function resetState() internal {
        for(uint256 i = state.length -1; i >= 0; i--){
            addressToState[state[i].aAddress] = 0;
            addressToState[state[i].bAddress] = 0;
            addressToState[state[i].cAddress] = 0;
            delete state[i];
        }
    }

    function burnTokens() internal {
        ERC20BurnableInterface.burn(
            ERC20BurnableInterface.balanceOf(address(this))
        );
    }

    function mintTokens(address _playerAddress, uint256 _numberOfTokens)
    internal
    {
        ERC20BurnableInterface.mint(_playerAddress, _numberOfTokens);
    }

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

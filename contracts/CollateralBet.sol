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
        uint256[3] memory input
    ) external view returns (bool r);
}

interface Verifier_circuit_claim {
    //All the winners,
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input
    ) external view returns (bool r);
}

contract CollateralBet is Ownable {
    CollateralToken private ERC20BurnableInterface;
    address public tokenAddress;
    address[] public registeredParticipants;

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
        uint256[3] aInput;
        uint256[3] bInput;
        uint256[3] cInput;
        uint256 total;
    }

    Container[] state;

    mapping(address => uint256) public hashMap;

    Verifier_circuit_participants public VerifierCircuitParticipantsInterface;
    Verifier_circuit_total public VerifierCircuitTotalInterface;
    Verifier_circuit_claim public VerifierCircuitClaimInterface;

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
        tokenAddress = _tokenAddress; //TODO: better have additional checks
        ERC20BurnableInterface = ERC20Burnable(tokenAddress);
        updateEpochTimestamp();

        VerifierCircuitParticipantsInterface = Verifier_circuit_participants(
            verifierCircuitParticipantsContract
        );
        VerifierCircuitTotalInterface = Verifier_circuit_total(
            verifierCircuitTotalContract
        );
        VerifierCircuitClaimInterface = Verifier_circuit_claim(
            verifierCircuitClaimContract
        );
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
                mintTokens(_unprocessedArray[i], 1);
                delete _unprocessedArray[i];
            }
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

    //TODO: getter for each stage for the UI

    function performSingleMPC(
        address aAddress,
        address bAddress,
        address cAddress
    ) internal {
        // uint balance[3] = [1, 2, 3];
        //   uint[3] memory c = [uint(1) , 2, 3];

        uint256[3] memory mock = [uint256(0), uint256(0), uint256(0)];
        Container memory container = Container(
            aAddress,
            bAddress,
            cAddress,
            Stage.Zero,
            mock,
            mock,
            mock,
            0
        );

        state.push(container);
        uint256 index = state.length - 1;
        hashMap[aAddress] = index;
        hashMap[bAddress] = index;
        hashMap[cAddress] = index;
    }

    function one() external {
        address _aAddress = msg.sender;
    }

    function two() external {
        address _bAddress = msg.sender;
    }

    function three() external {
        address _cAddress = msg.sender;
    }

    function four() external {
        address _aAddress = msg.sender;
    }

    function five() external {}

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

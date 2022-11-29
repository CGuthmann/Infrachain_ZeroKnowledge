pragma solidity ^0.8.17;

interface Verifier_circuit_participants{
    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input
        ) external view returns (bool r);
}

interface Verifier_circuit_total{
    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[4] memory input
        ) external view returns (bool r);
}

interface Verifier_circuit_claim{
    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input
        ) external view returns (bool r);    
}

contract testing {


    Verifier_circuit_participants verifier_circuit_participants;
    Verifier_circuit_total verifier_circuit_total;
    Verifier_circuit_claim verifier_circuit_claim;

    constructor(address participant_verifier_address, address total_verifier_address, address claim_verifier_address){
        verifier_circuit_participants = Verifier_circuit_participants(participant_verifier_address);
        verifier_circuit_total = Verifier_circuit_total(total_verifier_address);
        verifier_circuit_claim = Verifier_circuit_claim(claim_verifier_address);
    }
    function tst(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input)
    public view returns (bool r) {
        
        bool testBool = verifier_circuit_participants.verifyProof(a,b,c,input);
        
        return testBool;
    }


    function tst_total(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[4] memory input)
    public view returns (bool r) {
        
        bool testBool = verifier_circuit_total.verifyProof(a,b,c,input);
        
        return testBool;
    }

    function test_claim(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input)
    public view returns (bool r) {
        
        bool testBool = verifier_circuit_claim.verifyProof(a,b,c,input);
        
        return testBool;
    }

    function step1(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input)
    public view returns (bool r) {
        
        uint comA = input[0]; 
        uint comR = input[1];
        uint comAR = input[2];

    }
}
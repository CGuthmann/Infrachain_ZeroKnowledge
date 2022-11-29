const chai = require("chai");

const fs = require("fs");
const input_A = require("./input_A.json");


async function createInputs() {

    const input_A_claim = {
        "private_consumption": input_A.private_consumption,
        "totalSum": 1000000000
    };

    console.log(input_A_claim);

    fs.writeFileSync("input_A_claim.json", JSON.stringify(input_A_claim, null, 4));

}

createInputs();

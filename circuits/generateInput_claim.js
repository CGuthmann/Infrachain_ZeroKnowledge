const chai = require("chai");

const fs = require("fs");
const config = require("./config.json");

const input_A = require("./input_A.json");
const input_B = require("./input_B.json");
const input_C = require("./input_C.json");

const input_total = require("./input_total.json");

// console.log(input_total);

async function createInputs() {

    const input_claimA = {
        "totalSum": input_total.totalSum - input_A.current_sum,
        "private_consumption": input_A.private_consumption
    }

    console.log(input_claimA);

    fs.writeFileSync("input_claimA.json", JSON.stringify(input_claimA, null, 4));

    const input_claimB = {
        "totalSum": input_total.totalSum - input_A.current_sum,
        "private_consumption": input_B.private_consumption
    }

    console.log(input_claimB);

    fs.writeFileSync("input_claimB.json", JSON.stringify(input_claimB, null, 4));

    const input_claimC = {
        "totalSum": input_total.totalSum - input_A.current_sum,
        "private_consumption": input_C.private_consumption
    }

    console.log(input_claimC);

    fs.writeFileSync("input_claimC.json", JSON.stringify(input_claimC, null, 4));
    
}


createInputs();

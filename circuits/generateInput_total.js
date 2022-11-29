const chai = require("chai");

const fs = require("fs");
const config = require("./config.json");

const input_A = require("./inputs_A.json");
const input_C = require("./inputs_C.json");

async function createInputs() {

    const private_consumption = 1234;
    const r = 

    input_total = {
        "totalSum": input_C.currentSum + input_C.private_consumption,
        "r": input_A.r,
        "private_consumption": input_A.private_consumption
    }

    console.log(input_total);

    fs.writeFileSync("inputs_total.json", JSON.stringify(input_total, null, 4));
}

createInputs();

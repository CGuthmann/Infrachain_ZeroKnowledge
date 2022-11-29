const chai = require("chai");

const fs = require("fs");
const config = require("./config.json");

const input_A = require("./input_A.json");
const input_C = require("./input_C.json");

async function createInputs() {

    const private_consumption = 1234;

    const input_total = {
        "totalSum": input_C.current_sum + input_C.private_consumption,
        "r": input_A.current_sum,
        "private_consumption": input_A.private_consumption
    }

    console.log(input_total);

    fs.writeFileSync("input_total.json", JSON.stringify(input_total, null, 4));
}

createInputs();

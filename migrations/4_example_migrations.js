var MyContract = artifacts.require("HelloWorld");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};

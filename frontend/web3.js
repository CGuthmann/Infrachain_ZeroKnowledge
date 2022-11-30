import Web3 from "web3";

export var web3 = new Web3();
var initialized = false;

export async function initWeb3() {
  if (window.ethereum && !initialized) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    initialized = true;
    const walletAddress = "0xB97C8BB676df1A1bD1Ae5860A17d68c390ad2cCD";
    var balance = await web3.eth.getBalance(walletAddress);
    console.log(balance);
  }
}

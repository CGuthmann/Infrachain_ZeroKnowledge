import Web3 from "web3";

const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:23000'));

const eventHashes = [
    web3.utils.sha3('OneFinished(uint256[2],uint256[2][2],uint256[2],uint256[3])'),
    web3.utils.sha3('TwoFinished(uint256[2],uint256[2][2],uint256[2],uint256[3])'),
    web3.utils.sha3('ThreeFinished(uint256[2],uint256[2][2],uint256[2],uint256[3])'),
    web3.utils.sha3('FourFinished(uint256[2],uint256[2][2],uint256[2],uint256[4])'),
    web3.utils.sha3('FiveFinished(uint256[2],uint256[2][2],uint256[2],uint256[2])'),
];

const progressArray = [0, 0, 0, 0, 0]


const subscribe = (address, topic) => {
    const subscription = web3.eth.subscribe('logs', {
        address,
        topics: [topic],
    })

    subscription
        .on("connected", function (subscriptionId) {
            console.log('SubID: ', subscriptionId);
        })
        .on('data', function (event) {
            // console.debug('data', event);
            progressArray[eventHashes.indexOf(event.topics[0])]++
            console.log(progressArray)
        })
        .on('changed', function (event) {
            console.debug('changed', event)
        })
        .on('error', function (error, receipt) {
            console.error('error', error, receipt);
        });
}

const setUpListeners = async (address = '0x9Fb72d91b7cfA531fE40dD42704149e972543aEE') => {
    eventHashes.forEach(eventHash => subscribe(address, eventHash))
}

export {
    setUpListeners,
    progressArray
}
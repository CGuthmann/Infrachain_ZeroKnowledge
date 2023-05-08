import Web3 from "web3";
import {useCallback, useState} from 'react';


const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:23000'));

const eventHashes = [
    web3.utils.sha3('OneFinished(uint256[2],uint256[2][2],uint256[2],uint256[3])'),
    web3.utils.sha3('TwoFinished(uint256[2],uint256[2][2],uint256[2],uint256[3])'),
    web3.utils.sha3('ThreeFinished(uint256[2],uint256[2][2],uint256[2],uint256[3])'),
    web3.utils.sha3('FourFinished(uint256[2],uint256[2][2],uint256[2],uint256[4])'),
    web3.utils.sha3('FiveFinished(uint256[2],uint256[2][2],uint256[2],uint256[2])'),
];

const useSubscribe = (address, topic) => {
    const [data, setData] = useState(0);

    const subscription = web3.eth.subscribe('logs', {
        address,
        topics: [topic],
    })

    // const index = eventHashes.indexOf(topic)
    // setTimeout(()=>{
    //     setData(1)
    // }, 1000+1000*index)

    subscription
        .on("connected", function (subscriptionId) {
            console.log('SubID: ', subscriptionId);
        })
        .on('data', function (event) {
            // console.debug('data', event);
            setData(1)
        })
        .on('changed', function (event) {
            console.debug('changed', event)
        })
        .on('error', function (error, receipt) {
            console.error('error', error, receipt);
        });

    return [data];
}

export {
    useSubscribe,
    eventHashes,
}
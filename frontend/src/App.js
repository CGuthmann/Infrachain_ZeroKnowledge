import {useState, useEffect} from 'react'
import Web3 from 'web3';
import ProgressBar from './components/ProgressBar/ProgressBar'
import Header from "./components/Header/Header";
import './App.css'

import img0 from './assets/stages/Slide2.png';
import img1 from './assets/stages/Slide3.png';
import img2 from './assets/stages/Slide4.png';
import img3 from './assets/stages/Slide5.png';
import img4 from './assets/stages/Slide6.png';
import img5 from './assets/stages/Slide7.png';

const images = [img0, img1, img2, img3, img4, img5]

const address = '0x9Fb72d91b7cfA531fE40dD42704149e972543aEE'

const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:23000'));
const eventHashes = [
    web3.utils.sha3('OneFinished(uint256[2],uint256[2][2],uint256[2],uint256[3])'),
    web3.utils.sha3('TwoFinished(uint256[2],uint256[2][2],uint256[2],uint256[3])'),
    web3.utils.sha3('ThreeFinished(uint256[2],uint256[2][2],uint256[2],uint256[3])'),
    web3.utils.sha3('FourFinished(uint256[2],uint256[2][2],uint256[2],uint256[4])'),
    web3.utils.sha3('FiveFinished(uint256[2],uint256[2][2],uint256[2],uint256[2])'),
];


const App = () => {
    const [progress, setProgress] = useState(0)
    const [img, setImg] = useState(images[0])


    useEffect(() => {
        setImg(images[progress])
    }, [progress])

    useEffect(() => {
        document.title = "Partnership Day"

        eventHashes.forEach(topic => {
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
                    setProgress(prevProgress => {
                        const newProgress = prevProgress + 1
                        if (newProgress <= 5)
                            return newProgress
                        else {
                            return prevProgress
                        }
                    })
                })
                .on('changed', function (event) {
                    console.debug('changed', event)
                })
                .on('error', function (error, receipt) {
                    console.error('error', error, receipt);
                });
        })
    }, [])

    return (

        <div>
            <Header/>
            <div className="App">
                <img className="images" src={img}/>
                <ProgressBar progress={progress * 20} trackWidth={5} indicatorWidth={10}/>
            </div>
            <div className={'text-box'}>
                <textarea className={'presentation'} value={'Johannes, put your text in here'}/>
            </div>

        </div>
    )
}

export default App

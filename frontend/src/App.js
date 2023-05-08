import {useState, useEffect} from 'react'
import ProgressBar from './components/ProgressBar/ProgressBar'
import './App.css'
import {useSubscribe, eventHashes} from "./services/Web3";

import img0 from './assets/stages/Slide2.png';
import img1 from './assets/stages/Slide3.png';
import img2 from './assets/stages/Slide4.png';
import img3 from './assets/stages/Slide5.png';
import img4 from './assets/stages/Slide6.png';
import img5 from './assets/stages/Slide7.png';

const images = [img0, img1, img2, img3, img4, img5]

const App = () => {
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [img, setImg] = useState(images[0])

    const address = '0x9Fb72d91b7cfA531fE40dD42704149e972543aEE'
    const [one] = useSubscribe(address, eventHashes[0])
    const [two] = useSubscribe(address, eventHashes[1])
    const [three] = useSubscribe(address, eventHashes[2])
    const [four] = useSubscribe(address, eventHashes[3])
    const [five] = useSubscribe(address, eventHashes[4])
    const events = [one, two, three, four, five]


    useEffect(() => {
        if (loading >= 100) return
        const sum = events.reduce((partialSum, a) => partialSum + a, 0)
        console.log(sum)
        setImg(images[sum])
        setProgress(sum * 20)
    }, [progress, loading, events])

    useEffect(() => {
        document.title = "SVG Pi implemented in React"
    }, [])

    return (

        <div className="App">
            <img className="images" src={img}/>
            {loading ? (<ProgressBar progress={progress} trackWidth={5} indicatorWidth={10}/>) : (<div
                className="App-content">
                <p>This main page of the app shows up as soon as the <strong title="ProgressBar">SVG
                    Pi</strong> hits 100%.</p>
            </div>)}

        </div>)
}

export default App

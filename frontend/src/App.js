import {useState, useEffect} from 'react'
import ProgressBar from './components/ProgressBar/ProgressBar'
import './App.css'
import {setUpListeners, progressArray} from "./services/Web3";

const App = () => {
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let loadingTimeout = setInterval(() => {
            if (loading >= 100) return
            const sum = progressArray.reduce((partialSum, a) => partialSum + a, 0)
            setProgress(sum * 20)
        }, 1000)

        // if (progress === 100) {
        //     setLoading(false)
        // }

        return () => {
            clearTimeout(loadingTimeout)
        }
    }, [progress, loading])

    useEffect(() => {
        setUpListeners()
        document.title = "SVG Pi implemented in React"
    }, [])

    return (
        <div className="App">
            <div className="images">
            </div>
            {loading ? (
                <ProgressBar progress={progress} trackWidth={5} indicatorWidth={10}/>
            ) : (
                <div
                    className="App-content"
                >
                    <p>This main page of the app shows up as soon as the <strong title="ProgressBar">SVG
                        Pi</strong> hits 100%.</p>
                </div>
            )}

        </div>
    )
}

export default App

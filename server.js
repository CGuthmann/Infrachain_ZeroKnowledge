const express = require('express')
const {playGame} = require("./playGame")
const {prepareGame} = require("./prepareGame")
const app = express()
const port = 8080

app.get('/play-game', (req, res) => {
    playGame()
    res.send('Launching playGame.js!')
})

app.get('/prepare-game', (req, res) => {
    prepareGame()
    res.send('Launching prepareGame.js!')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

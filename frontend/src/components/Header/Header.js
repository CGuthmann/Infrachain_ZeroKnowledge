import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import './Header.css'

const prepareGame = ()=>{
    fetch('http://localhost:8080/prepare-game')
        .then(console.debug)
        .catch(console.error)
}

const playGame = ()=>{
    fetch('http://localhost:8080/play-game')
        .then(console.debug)
        .catch(console.error)
}

export default function Header() {
    return (
        <AppBar position="static" className={'header'}>
            <Toolbar>
                <Typography variant="h6"
                            component="div" sx={{flexGrow: 1}}>
                    Financial MPC+ZKP
                </Typography>
                <Button color="inherit" onClick={prepareGame}>Prepare</Button>
                <Button color="inherit" onClick={playGame}>Play</Button>
            </Toolbar>
        </AppBar>
    );
}
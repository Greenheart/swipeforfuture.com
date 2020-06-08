import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'

import Game from './components/Game'
import { loadScenario } from './game/load-scenario'
import { GameWorld } from './game/ContentTypes'

const Container = styled.main`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    background: #546a76;
    display: grid;
    grid-template-rows: minmax(50px, 80px) auto minmax(50px, 80px);
`
type AppProps = {
    path: string
}

function App({ path }: AppProps) {
    const [scenario, setScenario] = useState<GameWorld | null>(null)
    useEffect(() => {
        const fetchWorld = async () => {
            const scenario = await loadScenario(path)
            setScenario(scenario)
        }
        fetchWorld()
    }, [path, setScenario])
    return <Container>{scenario && <Game scenario={scenario} />}</Container>
}

export default App

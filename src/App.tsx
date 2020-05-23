import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'

import Game from './components/Game'
import { loadGameWorld } from './game/GameWorld'
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
    const [worldData, setWorldData] = useState<GameWorld | null>(null)
    useEffect(() => {
        const fetchWorld = async () => {
            const worldData = await loadGameWorld(path)
            setWorldData(worldData)
        }
        fetchWorld()
    }, [path, setWorldData])
    return <Container>{worldData && <Game worldData={worldData} />}</Container>
}

export default App

import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import { createGlobalStyle } from 'styled-components'

import Game from './components/Game'
import { Game as GameLogic, BasicGameScenario } from './game'
import { WorldState } from './game/ContentTypes'
import { loadScenario } from './game/load-scenario'

const Container = styled.main`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    background: #ccdddd;
    display: flex;
    flex-direction: column;
`
const GlobalStyles = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    html,
    body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        user-select: none;
        position: fixed;
        overflow: hidden;
    }
`

type AppProps = {
    path: string
}

function App({ path }: AppProps) {
    const [game, setGame] = useState<GameLogic<WorldState> | null>(null)
    useEffect(() => {
        const fetchWorld = async () => {
            const scenarioData = await loadScenario(path)
            if (scenarioData) {
                const instance = BasicGameScenario.fromData(scenarioData)
                setGame(instance)
            } else {
                console.warn('Scenario loading error')
            }
        }
        fetchWorld()
    }, [path, setGame])
    return (
        <Container>
            <GlobalStyles />
            {game && <Game game={game} />}
        </Container>
    )
}

export default App

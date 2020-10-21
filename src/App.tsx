import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import { createGlobalStyle } from 'styled-components'

import Game from './components/Game'
import { GameScenario, BasicGameScenario } from './game/GameScenario'
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
    const [scenario, setScenario] = useState<GameScenario | null>(null)
    useEffect(() => {
        const fetchWorld = async () => {
            const scenarioData = await loadScenario(path)
            if (scenarioData) {
                const instance = BasicGameScenario.fromData(scenarioData)
                setScenario(instance)
            } else {
                console.warn('Scenario loading error')
            }
        }
        fetchWorld()
    }, [path, setScenario])
    return (
        <Container>
            <GlobalStyles />
            {scenario && <Game scenario={scenario} />}
        </Container>
    )
}

export default App

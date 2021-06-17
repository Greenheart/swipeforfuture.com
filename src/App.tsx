import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import { createGlobalStyle } from 'styled-components'

import Game from './components/Game'
import { Game as GameLogic, BasicGameScenario } from './game'
import * as GameWorldLoader from './game/GameWorldLoader'
import { loadScenario } from './game/load-scenario'
import { builder } from "./dev-mode/excel-utils"

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
    useBasicGame?: boolean
}

const DevMode = styled.div`
    display: block;
    position: absolute:
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 20px;
`

export async function uploadObject(file: File) {
    const reader = new FileReader();
    console.log(file)
    const loadPromise = new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        reader.onload = (event) => {
            if (event.target) {
                const content = event.target.result;
                console.log(typeof content)
                resolve(content);
            } else {
                reject('Could not load file.');
            }
        }
    });
    reader.readAsBinaryString(file);
    const data = await loadPromise;
    const scenario = builder.run(data);
    console.log(scenario);
    localStorage.setItem('game_world:dev-mode', JSON.stringify(scenario))
}

function App({ path, useBasicGame = false }: AppProps) {
    const [game, setGame] = useState<GameLogic<any> | null>(null)
    useEffect(() => {
        const fetchWorld = async () => {
            const scenarioData = await loadScenario(path)
            if (scenarioData) {
                const instance = useBasicGame
                    ? BasicGameScenario.fromData(scenarioData)
                    : GameWorldLoader.load(scenarioData)
                setGame(instance)
            } else {
                console.warn('Scenario loading error')
            }
        }
        fetchWorld()
    }, [path, useBasicGame, setGame])
    return (
        <Container>
            <GlobalStyles />
            {game && <Game game={game} />}
            <DevMode>
                <input
                    type="file"
                    onChange={(event) => event.target && event.target.files && uploadObject(event.target.files[0])}
                />
            </DevMode>
        </Container>
    )
}

export default App

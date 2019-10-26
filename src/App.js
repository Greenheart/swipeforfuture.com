import React from 'react'
import styled from 'styled-components/macro'

import Stats from './components/Stats'
import Deck from './components/Deck'

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

const Footer = styled.footer`
    display: flex;
    justify-content: center;
    align-items: center;
`

function App() {
    return (
        <Container>
            <Stats
                stats={{ environment: 18, people: 58, security: 77, money: 32 }}
            />
            <Deck />
            <Footer>
                <div className="time-remaining"></div>
            </Footer>
        </Container>
    )
}

export default App

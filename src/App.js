import React from 'react'
import styled from 'styled-components/macro'

import Stats from './components/Stats'

const Container = styled.main`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    background: lightslategrey;
    display: grid;
    grid-template-rows: 100px auto 150px;
`

const Footer = styled.footer`
    background: lightgoldenrodyellow;
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
            <div className="decision"></div>
            <Footer>
                <div className="time-remaining"></div>
            </Footer>
        </Container>
    )
}

export default App

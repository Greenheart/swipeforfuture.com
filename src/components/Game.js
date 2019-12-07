import React, { Component } from 'react'
import styled from 'styled-components'

import Deck from './Deck'
import Stats from './Stats'

const Footer = styled.footer`
    display: flex;
    justify-content: center;
    align-items: center;
`

export default class Game extends Component {
    state = {
        world: {
            environment: 40,
            people: 60,
            security: 75,
            money: 90
        }
    }

    render() {
        return (
            <>
                <Stats stats={this.state.world} />
                <Deck />
                <Footer>
                    <div className="time-remaining"></div>
                </Footer>
            </>
        )
    }
}

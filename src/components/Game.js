import React, { Component } from 'react'
import styled from 'styled-components'

import Deck from './Deck'
import Stats from './Stats'
import cards from '../data/cards.js'

const Footer = styled.footer`
    display: flex;
    justify-content: center;
    align-items: center;
`

const DIRECTION = {
    LEFT: -1,
    RIGHT: 1
}

export default class Game extends Component {
    state = {
        world: {
            environment: 40,
            people: 60,
            security: 75,
            money: 90
        },
        hasEnded: false
    }

    render() {
        return (
            <>
                <Stats stats={this.state.world} />
                <Deck
                    key={this.state.hasEnded}
                    onSwipe={this.onSwipe.bind(this)}
                    cards={cards.filter(c =>
                        this.state.hasEnded
                            ? c.type === 'endgame'
                            : c.type === 'decision'
                    )}
                />
                <Footer>
                    <div className="time-remaining"></div>
                </Footer>
            </>
        )
    }

    onSwipe(card, direction) {
        if (card.type === 'endgame') {
            this.findNewWorldToDestroy()
            return
        }
        console.log('swipe ', direction, card.title)
        this.updateWorld(
            direction === DIRECTION.LEFT
                ? card.actions.left.modifier
                : card.actions.right.modifier
        )

        this.checkEndgame()
    }

    updateWorld(modifier) {
        const currentWorld = Object.assign({}, this.state.world)

        const updatedWorld = Object.entries(modifier).reduce(
            (updatedState, [key, value]) => {
                updatedState[key] = Math.max(
                    Math.min(value + updatedState[key], 100),
                    0
                )

                return updatedState
            },
            currentWorld
        )

        const updated = { world: updatedWorld }
        this.setState(updated)
    }

    checkEndgame() {
        const isGameLost = Object.values(this.state.world).some(
            stat => stat <= 0
        )
        if (isGameLost) {
            this.setState({ hasEnded: true })
        }
    }

    findNewWorldToDestroy() {
        window.setTimeout(() => {
            this.setState({
                world: {
                    environment: 40,
                    people: 60,
                    security: 75,
                    money: 90
                },
                hasEnded: false
            })
        }, 600)
    }
}

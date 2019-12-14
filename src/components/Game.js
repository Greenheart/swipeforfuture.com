import React, { Component } from 'react'
import styled from 'styled-components/macro'

import Deck from './Deck'
import Stats from './Stats'
import cardList from '../data/cards.js'

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
    state = this.getInitialState()

    getInitialState() {
        return {
            world: {
                environment: 40,
                people: 60,
                security: 75,
                money: 90
            },
            cards: cardList,
            hasEnded: false
        }
    }

    render() {
        return (
            <>
                <Stats stats={this.state.world} />
                <Deck
                    onSwipe={this.onSwipe.bind(this)}
                    cards={this.state.cards.filter(c =>
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

        const updatedWorld = this.updateWorld(
            direction === DIRECTION.LEFT
                ? card.actions.left.modifier
                : card.actions.right.modifier
        )

        const isGameLost = this.checkEndgame(updatedWorld)

        const cards = this.state.cards.filter(c => c !== card);
        const updated = {
            world: updatedWorld,
            hasEnded: isGameLost,
            cards: cards
        }
        this.setState(updated)
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

        return updatedWorld;
    }

    checkEndgame(world) {
        const isGameLost = Object.values(world).some(
            stat => stat <= 0
        )
        return isGameLost;
    }

    findNewWorldToDestroy() {
        window.setTimeout(() => {
            this.setState(this.getInitialState())
        }, 600)
    }
}

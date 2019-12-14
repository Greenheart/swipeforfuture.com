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

const GAMESTATE = {
    ENDGAME: 'endgame',
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
            cards: this.generateCards().filter(c => c.type !== GAMESTATE.ENDGAME),
            hasEnded: false
        }
    }

    render() {
        return (
            <>
                <Stats stats={this.state.world} />
                <Deck
                    onSwipe={this.onSwipe.bind(this)}
                    cards={this.state.cards}
                />
                <Footer>
                    <div className="time-remaining"></div>
                </Footer>
            </>
        )
    }

    onSwipe(card, direction) {
        if (card.type === GAMESTATE.ENDGAME) {
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

        const updatedCards = isGameLost
            ? this.generateCards().filter(c => c.type === GAMESTATE.ENDGAME)
            : cards.length === 0
            ? this.generateCards().filter(c => c.type !== GAMESTATE.ENDGAME)
            : cards

        const updated = {
            world: updatedWorld,
            hasEnded: isGameLost,
            cards: updatedCards
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
        this.setState(this.getInitialState())
    }

    generateCards() {
        return cardList.map((card, index) => ({
            ...card,
            id: Date.now() + ":" + index
        }))
    }
}

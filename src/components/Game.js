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
        const world = {
            state: {
                environment: 40,
                people: 60,
                security: 75,
                money: 90
            },
            flags: {
                
            }
        }

        const availableCards = this.getAvailableCards(world)

        return {
            world,
            card: this.selectNextCard(availableCards),
        }
    }

    getAvailableCards(world) {
        return cardList.filter(c => c.isIncluded(world))
    }

    render() {
        return (
            <>
                <Stats stats={this.state.world.state} />
                <Deck
                    onSwipe={this.onSwipe.bind(this)}
                    cards={[this.addUniqueCardId(this.state.card)]}
                />
                <Footer>
                    <div className="time-remaining"></div>
                </Footer>
            </>
        )
    }

    onSwipe(card, direction) {
        const updatedWorld = this.getUpdatedWorld(
            direction === DIRECTION.LEFT
                ? card.actions.left
                : card.actions.right
        )
        
        // get available events
            // call event.shouldTrigger()

        // if select event of available event
            // trigger event
        // else
            // selectNextCard()
            
        const availableCards = this.getAvailableCards(updatedWorld)
        const selectedCard = this.selectNextCard(availableCards)

        const updated = {
            world: updatedWorld,
            card: selectedCard
        }
        this.setState(updated)
    }

    getUpdatedWorld({ modifier = {}, flags = {} }) {
        const updatedWorldState = this.updateWorldState(modifier)
        const updatedWorldFlags = this.updateWorldFlags(flags)
        
        return {
            state: updatedWorldState,
            flags: updatedWorldFlags
        }
    }

    updateWorldState(modifier) {
        const currentWorldState = Object.assign({}, this.state.world.state)

        const updatedWorldState = Object.entries(modifier).reduce(
            (updatedState, [key, value]) => {
                updatedState[key] = Math.max(
                    Math.min(value + updatedState[key], 100),
                    0
                )

                return updatedState
            },
            currentWorldState
        )

        return updatedWorldState;
    }

    updateWorldFlags(flags) {
        const currentWorldFlags = Object.assign({}, this.state.world.flags)

        const updatedWorldFlags = Object.keys(flags).reduce(
            (updatedFlags, key) => {
                updatedFlags[key] = flags[key];
                return updatedFlags
            },
            currentWorldFlags
        )

        return updatedWorldFlags;
    }

    addUniqueCardId(card, index = 0) {
        return {
            ...card,
            id: Date.now() + ":" + index
        };
    }

    selectNextCard(cards = []) {
        return cards[Math.floor(Math.random() * cards.length)];
    }
}

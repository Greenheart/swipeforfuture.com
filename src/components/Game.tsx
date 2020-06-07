import React, { Component } from 'react'
import styled from 'styled-components/macro'

import Deck from './Deck'
import Stats from './Stats'
import { SwipeDirection } from '../util/constants'
import GameScenario from '../game/GameScenario'

import {
    GameWorld,
    WorldState,
    CardData,
    EventCard,
    WorldEvent,
} from '../game/ContentTypes'

const Footer = styled.footer`
    display: flex;
    justify-content: center;
    align-items: center;
`

type GameProps = {
    worldData: GameWorld
}

type GameState = {
    world: WorldState
    card: CardData | EventCard
    rounds: number
}

declare global {
    interface Window {
        DEV_TOOLS_ACTIVE: Boolean
        DEV_TOOLS: {
            availableCards?: CardData[]
            availableEvents?: WorldEvent[]
            nextCard?: CardData | EventCard
            game?: GameState
        }
    }
}

// Enable DEV_TOOLS for local development by default to improve DX
window.DEV_TOOLS_ACTIVE = window.location.hostname.includes('localhost')
window.DEV_TOOLS = {}

export default class Game extends Component<GameProps, GameState> {
    constructor() {
        this.scenario = new GameScenario(this.props.worldData)
        this.state = this.scenario.getInitialState()
    }

    render() {
        const card = this.addUniqueCardId(this.state.card)
        const worldState = this.state.world.state
        const stats = this.props.worldData.stats.map((stat) =>
            Object.assign({}, stat, {
                value: worldState[stat.id],
            }),
        )
        return (
            <>
                <Stats stats={stats} />
                <Deck
                    onSwipe={this.onSwipe.bind(this)}
                    card={card}
                    tick={this.state.rounds}
                />
                <Footer>
                    <div className="time-remaining"></div>
                </Footer>
            </>
        )
    }

    // TODO: Handle the game state update on each swipe.
    // Call some kind of update method in the game scenario and store the result in
    onSwipe(card: CardData | EventCard, direction: SwipeDirection): void {
        const currentAction =
            direction === SwipeDirection.Left
                ? card.actions.left
                : card.actions.right

        const updatedWorld = this.getUpdatedWorld(currentAction.modifier)

        this.setState({
            world: updatedWorld,
            card: this.getNextCard(updatedWorld, card, currentAction),
            rounds: this.state.rounds + 1,
        })
    }
}

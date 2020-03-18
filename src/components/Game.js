import React, { Component } from 'react'
import styled from 'styled-components/macro'

import Deck from './Deck'
import Stats from './Stats'
import { SWIPE_DIRECTION } from '../util/constants'

const Footer = styled.footer`
    display: flex;
    justify-content: center;
    align-items: center;
`

export default class Game extends Component {
    state = this.getInitialState()

    render() {
        const card = this.addUniqueCardId(this.state.card)
        return (
            <>
                <Stats
                    stats={this.state.world.state}
                    params={this.props.worldData.gameParams}
                />
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

    getInitialState() {
        return {
            world: this.props.worldData.defaultState,
            card: this.selectNextCard(
                this.getAvailableCards(this.props.worldData.defaultState),
            ),
            rounds: 0,
        }
    }

    getAvailableCards(world) {
        const { cards } = this.props.worldData
        return cards.filter(c =>
            this.hasMatchingWorldQuery(world, c.isAvailableWhen),
        )
    }

    getAvailableEvents(world) {
        const { events } = this.props.worldData
        return events.filter(e =>
            this.hasMatchingWorldQuery(world, e.shouldTriggerWhen),
        )
    }

    hasMatchingWorldQuery(world, worldQueries) {
        return worldQueries.some(q => this.isMatchingWorldQuery(world, q))
    }

    isMatchingWorldQuery(world, { state = {}, flags = {} }) {
        const hasStateMatch = Object.entries(state).every(
            ([key, [min, max]]) =>
                world.state[key] >= min && world.state[key] <= max,
        )

        const result =
            hasStateMatch &&
            Object.entries(flags).every(
                ([flag, value]) => world.flags[flag] === value,
            )

        return result
    }

    onSwipe(card, direction) {
        const currentAction =
            direction === SWIPE_DIRECTION.LEFT
                ? card.actions.left
                : card.actions.right

        const updatedWorld = this.getUpdatedWorld(currentAction.modifier)

        this.setState({
            world: updatedWorld,
            card: this.getNextCard(updatedWorld, card, currentAction),
            rounds: this.state.rounds + 1,
        })
    }

    getNextCard(updatedWorld, card, currentAction) {
        const { eventCards } = this.props.worldData
        const availableEvents = this.getAvailableEvents(updatedWorld)
        const eventStartingNow =
            card.type !== 'event' ? this.selectNextEvent(availableEvents) : null
        let nextCard

        const isEventCardWithPointer =
            card.type === 'event' &&
            typeof currentAction.nextEventCardId === 'string'

        // Only select the next EventCard if a specific one is given
        // Else cancel the event and continue with normal cards.
        if (isEventCardWithPointer) {
            if (!eventCards.hasOwnProperty(currentAction.nextEventCardId)) {
                throw new Error(
                    `eventCardId "${currentAction.nextEventCardId}" does not exist. Make sure it's spelled correctly`,
                )
            }
            nextCard = this.selectEventCard(currentAction.nextEventCardId)
        } else if (eventStartingNow) {
            nextCard = this.selectEventCard(eventStartingNow.initialEventCardId)
        } else {
            const availableCards = this.getAvailableCards(updatedWorld)
            nextCard = this.selectNextCard(availableCards)
        }

        return nextCard
    }

    getUpdatedWorld({ type = 'add', state = {}, flags = {} }) {
        // get default values for missing props by destructuring the incoming `modifier` and then directly reassembling it
        // IDEA: Could this all be done in the function declaration, when specifying parameters?
        const modifier = { type, state, flags }
        const updatedWorldState = this.updateWorldState(modifier)
        const updatedWorldFlags = this.updateWorldFlags(modifier)

        return {
            state: updatedWorldState,
            flags: updatedWorldFlags,
        }
    }

    updateWorldState(modifier) {
        const currentWorldState =
            modifier.type === 'replace'
                ? Object.assign({}, this.props.worldData.defaultState.state)
                : Object.assign({}, this.state.world.state)

        const updatedWorldState = Object.entries(modifier.state).reduce(
            (updatedState, [key, value]) => {
                const newValue =
                    modifier.type === 'set' || modifier.type === 'replace'
                        ? value
                        : value + (updatedState[key] || 0)

                updatedState[key] = Math.min(Math.max(newValue, 0), 100)

                return updatedState
            },
            currentWorldState,
        )

        return updatedWorldState
    }

    updateWorldFlags(modifier) {
        const currentWorldFlags =
            modifier.type === 'replace'
                ? Object.assign({}, this.props.worldData.flags)
                : Object.assign({}, this.state.world.flags)

        const updatedWorldFlags = Object.keys(modifier.flags).reduce(
            (updatedFlags, key) => {
                updatedFlags[key] = modifier.flags[key]
                return updatedFlags
            },
            currentWorldFlags,
        )

        return updatedWorldFlags
    }

    addUniqueCardId(card, index = 0) {
        return {
            ...card,
            id: Date.now() + ':' + index,
        }
    }

    selectNextCard(cards = []) {
        return this.selectRandomFrom(cards)
    }

    selectNextEvent(events = []) {
        const event = this.selectRandomFrom(events)
        if (event && Math.random() < event.probability) {
            return event
        }
    }

    selectRandomFrom(array) {
        return array[Math.floor(Math.random() * array.length)]
    }

    selectEventCard(cardId) {
        const { eventCards } = this.props.worldData
        return eventCards[cardId]
    }
}

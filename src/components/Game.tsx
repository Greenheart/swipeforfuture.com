import React, { useState } from 'react'
import styled from 'styled-components/macro'

import Deck from './Deck'
import Stats from './Stats'
import { SwipeDirection } from '../util/constants'
import { getInitialState, getUpdatedState } from '../game/GameScenario'
import { GameWorld, CardData, EventCard } from '../game/ContentTypes'

const Footer = styled.footer`
    display: flex;
    justify-content: center;
    align-items: center;
`

// IDEA: Rename `worldData` to `scenario` to clarify the purpose of this data.
// It would make it easier to understand how game scenarios simply define the default data, while `GameState` is used during runtime.
type GameProps = {
    worldData: GameWorld
}

const Game: React.FunctionComponent<GameProps> = ({ worldData }) => {
    const [state, setState] = useState(getInitialState(worldData))

    const card = addUniqueCardId(state.card)
    const worldState = state.world.state
    const stats = worldData.stats.map((stat) =>
        Object.assign({}, stat, {
            value: worldState[stat.id],
        }),
    )

    function onSwipe(
        card: CardData | EventCard,
        direction: SwipeDirection,
    ): void {
        setState(getUpdatedState(worldData, state, card, direction))
    }

    return (
        <>
            <Stats stats={stats} />
            <Deck onSwipe={onSwipe} card={card} tick={state.rounds} />
            <Footer>
                <div className="time-remaining"></div>
            </Footer>
        </>
    )
}

function addUniqueCardId(
    card: CardData | EventCard,
    index: number = 0,
): (CardData | EventCard) & { id: string } {
    return {
        ...card,
        id: Date.now() + ':' + index,
    }
}

export default Game

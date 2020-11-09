import React, { useState } from 'react'
import styled from 'styled-components/macro'

import Deck from './Deck'
import Stats from './Stats'
import { SwipeDirection } from '../util/constants'
import { GameState, Game as GameLogic } from '../game/Types'

const Footer = styled.footer`
    display: flex;
    justify-content: center;
    align-items: center;
`

type GameProps<P> = {
    game: GameLogic<P>
}

function Game<P>({ game }: GameProps<P>): React.ReactElement<any, any> | null {
    const [state, setState] = useState<GameState<P>>(() => game.initialState)
    const [tick, setTick] = useState<number>(0)

    const stats = game.stats.map((stat) =>
        Object.assign({}, stat, {
            value: stat.getValue(state),
        }),
    )

    function onSwipe(direction: SwipeDirection): void {
        if (!state.card) return

        const action =
            direction === SwipeDirection.Left
                ? state.card.actions.left.modifier
                : state.card.actions.right.modifier

        setState(game.applyAction(state, action))
        setTick(tick + 1)
    }

    return (
        <>
            <Stats stats={stats} />
            {state.card ? (
                <Deck onSwipe={onSwipe} card={state.card} tick={tick} />
            ) : null}
            <Footer>
                <div className="time-remaining"></div>
            </Footer>
        </>
    )
}

export default Game

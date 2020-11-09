import React from 'react'

import { Card } from './Card'
import { DummyCard } from './CardView'
import { SwipeDirection } from '../util/constants'
import { CardPresentation } from '../game/Types'

type DeckProps = {
    onSwipe: (direction: SwipeDirection) => void
    card: CardPresentation
    tick: number
}
const Deck: React.FunctionComponent<DeckProps> = ({
    onSwipe,
    card,
    tick = 0,
}) => {
    const cardStack = Array.apply(null, Array(5)).map((_, index) => index)
    return (
        <div className="deck-root">
            {cardStack.map((key, index, list) => (
                <DummyCard
                    x={0}
                    y={
                        -20 +
                        list[loopingIndex(index, list.length, tick)] *
                            (50 / list.length)
                    }
                    key={index}
                    r={Math.sin(key * 2345) * 1}
                    layer={list.length - loopingIndex(index, list.length, tick)}
                />
            ))}
            <Card
                i={0}
                key={tick}
                card={card}
                onSwipe={onSwipe}
                layer={cardStack.length + 1}
            />
        </div>
    )
}

function loopingIndex(index: number, length: number, tick: number) {
    const result = (length + index - (tick % length)) % length
    return result
}

export default Deck

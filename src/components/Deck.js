import React from 'react'

import Card from './Card'
import DummyCard from './DummyCard'
import './Deck.scss'

function Deck({ onSwipe, card, tick = 0 }) {
    const cardStack = Array.apply(null, Array(5)).map((_, index) => index)
    return (
        <div className="deck-root">
            {cardStack.map((key, index, list) => (
                <DummyCard
                    x={0}
                    y={
                        10 +
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
                key={card.id}
                cardData={card}
                onSwipe={onSwipe}
                layer={cardStack.length + 1}
            />
        </div>
    )
}

function loopingIndex(index, length, tick) {
    const result = (length + index - (tick % length)) % length
    return result
}

export default Deck

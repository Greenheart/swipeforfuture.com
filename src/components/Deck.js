import React from 'react'

import Card from './Card'
import DummyCard from './DummyCard'
import './Deck.css'

function Deck({ onSwipe, cards, tick = 0 }) {
    return (
        <div className="deck-root">
            {[0, 1, 2, 3, 4, 5].map((key, index, list) => (
                <DummyCard
                    x={0}
                    y={50 + key * -10}
                    key={list[loopingIndex(index, list.length, tick)]}
                    r={Math.sin(list[loopingIndex(index, list.length, tick)] * 2345) * 2.5}
                />
            ))}
            {cards.map((card, i) => (
                <Card
                    i={i}
                    key={card.id}
                    cardData={card}
                    onSwipe={onSwipe}
                />
            ))}
        </div>
    )
}

function loopingIndex(index, length, tick) {
    const result = (length + index - (tick % length)) % length
    return result
}

export default Deck

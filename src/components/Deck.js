import React from 'react'

import Card from './Card'
import './Deck.css'

function Deck({ onSwipe, cards }) {
    return (
        <div className="deck-root">
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

export default Deck

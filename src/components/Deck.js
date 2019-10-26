import React, { useState } from 'react'
import { useSprings } from 'react-spring/hooks'
import { useGesture } from 'react-with-gesture'

import Card from './Card'
import cards from '../data/cards.js'

import './Deck.css'

const to = i => ({
    x: 0,
    y: i * -10,
    scale: 1,
    rot: Math.random() * 5,
    delay: i * 100
})
const from = i => ({ rot: 0, scale: 1.5, y: -1000 })

const trans = (r, s) =>
    `perspective(1500px) rotateX(30deg) rotateY(${r /
        10}deg) rotateZ(${r}deg) scale(${s})`

function Deck() {
    const [gone] = useState(() => new Set())

    const [cardAnimationStates, setCardAnimationState] = useSprings(
        cards.length,
        i => ({
            ...to(i),
            from: from(i)
        })
    )

    const bind = useGesture(
        ({
            args: [index],
            down,
            delta: [xDelta],
            distance,
            direction: [xDir],
            velocity
        }) => {
            const trigger = velocity > 0.2

            const dir = xDir < 0 ? -1 : 1

            if (!down && trigger) gone.add(index)

            setCardAnimationState(i => {
                if (index !== i) return
                const isGone = gone.has(index)

                const x = isGone
                    ? (200 + window.innerWidth) * dir
                    : down
                    ? xDelta
                    : 0

                const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0)

                const scale = down ? 1.1 : 1
                return {
                    x,
                    rot,
                    scale,
                    delay: undefined,
                    config: {
                        friction: 50,
                        tension: down ? 800 : isGone ? 200 : 500
                    }
                }
            })

            if (!down && gone.size === cards.length)
                setTimeout(
                    () => gone.clear() || setCardAnimationState(i => to(i)),
                    600
                )
        }
    )

    return (
        <div className="deck-root">
            {cardAnimationStates.map(({ x, y, rot, scale }, i) => (
                <Card
                    i={i}
                    key={i}
                    x={x}
                    y={y}
                    rot={rot}
                    scale={scale}
                    trans={trans}
                    cardData={cards[i]}
                    bind={bind}
                />
            ))}
        </div>
    )
}

export default Deck

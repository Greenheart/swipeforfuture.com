import React from 'react'
import { animated, interpolate } from 'react-spring/hooks'
import { useSpring } from 'react-spring/hooks'
import { useGesture } from 'react-with-gesture'

const to = i => ({
    x: 0,
    y: i * -10,
    scale: 1,
    rot: Math.random() * 2,
    delay: i * 100
})
const from = i => ({ rot: 0, scale: 1.5, y: -1000 })

const trans = (r, s) =>
    `perspective(1500px) rotateX(30deg) rotateY(${r /
        10}deg) rotateZ(${r}deg) scale(${s})`

function Card({ i, cardData, onSwipe }) {
    const { title, distance, text, image } = cardData

    const [cardAnimationState, setCardAnimationState] = useSpring(() => ({
            ...to(i),
            from: from(i)
        })
    )
    
    const isGone = false;

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

            if (!down && trigger) {
                // Handle game state updates
                onSwipe(cardData, dir)
            }

            const x = isGone
                    ? (200 + window.innerWidth) * dir
                    : down
                    ? xDelta
                    : 0

            const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0)
            const scale = down ? 1.1 : 1
            
            const animationState = {
                x,
                rot,
                scale,
                delay: undefined,
                config: {
                    friction: 50,
                    tension: down ? 800 : isGone ? 200 : 500
                }
            }

            setCardAnimationState(animationState)
        }
    )

    const { x, y, rot, scale } = cardAnimationState

    return (
        <animated.div
            key={i}
            style={{
                transform: interpolate(
                    [x, y],
                    (x, y) => `translate3d(${x}px,${y}px,0)`
                )
            }}>
            <animated.div
                {...bind(i)}
                style={{
                    transform: interpolate([rot, scale], trans)
                }}>
                <div className="card">
                    <img
                        src={image ? image : ''}
                        alt={title}
                        style={{ width: '100%' }}
                    />
                    <h2>{title}</h2>
                    <h5>{distance}</h5>
                    <h5>{text}</h5>
                </div>
            </animated.div>
        </animated.div>
    )
}

export default Card

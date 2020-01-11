import React, { useState } from 'react'
import { animated, interpolate } from 'react-spring/hooks'
import { useSpring } from 'react-spring/hooks'
import { useGesture } from 'react-with-gesture'

import { useKeyboardEvent } from '../util/hooks'
import { SWIPE_DIRECTION } from '../util/constants'

const to = i => ({
    x: 0,
    y: 0,
    scale: 1,
    rot: 0,
    delay: i * 100,
})
const from = i => ({ rot: 0, scale: 1.0, y: 10 })

const trans = (r, s) =>
    `perspective(1500px) rotate3d(1, 0, 0, 30deg) rotate3d(0, 0, 1, ${r}deg) scale(${s})`

const getDeltaX = () => getThreshold() / window.devicePixelRatio

const getThreshold = () => Math.min(200, window.innerWidth / 2)

function Card({ i, cardData, onSwipe, layer }) {
    const { title, distance, text, image } = cardData

    const [cardAnimationState, setCardAnimationState] = useSpring(() => ({
        ...to(i),
        from: from(i),
    }))

    const [cardState] = useState({ isGone: false, currentKey: null })

    const gestureControl = ({
        args: [index],
        down,
        delta: [xDelta],
        distance,
        direction: [xDir],
        velocity,
    }) => {
        const trigger =
            Math.abs(xDelta) * window.devicePixelRatio > getThreshold()
        const dir = Math.sign(xDelta)

        if (!down && trigger && !cardState.isGone) {
            // Handle game state updates
            cardState.isGone = true
            window.setTimeout(() => {
                onSwipe(cardData, dir)
                cardState.currentKey = null
            }, 200)
        }
        const isGone = cardState.isGone

        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0

        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0)
        const scale = down ? 1.1 : 1

        const animationState = {
            x,
            rot,
            scale,
            delay: undefined,
            config: {
                friction: 50,
                tension: down ? 800 : isGone ? 200 : 500,
            },
        }

        setCardAnimationState(animationState)
    }

    useKeyboardEvent(['ArrowLeft', 'ArrowRight'], (down, key) => {
        if (down && !cardState.currentKey) {
            cardState.currentKey = key
        }
        if (cardState.currentKey === key) {
            const directionX =
                key === 'ArrowLeft'
                    ? SWIPE_DIRECTION.LEFT
                    : SWIPE_DIRECTION.RIGHT
            gestureControl({
                down,
                delta: [directionX * (getDeltaX() + 1), 0],
                direction: [directionX, 0],
                args: [0],
                distance: 0,
                velocity: 5,
            })
        }
    })

    const bind = useGesture(args => {
        if (!cardState.currentKey) gestureControl(args)
    })

    const { x, y, rot, scale } = cardAnimationState

    return (
        <animated.div
            className="card-container"
            key={i}
            style={{
                position: 'absolute',
                transform: interpolate(
                    [x, y],
                    (x, y) => `translate3d(${x}px,${y}px,0)`,
                ),
                zIndex: layer,
            }}
        >
            <animated.div
                className="card card-front"
                {...bind(i)}
                style={{
                    transform: interpolate([rot, scale], trans),
                }}
            >
                <div className="card-content">
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

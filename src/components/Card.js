import React, {useState} from 'react'
import { animated, interpolate } from 'react-spring/hooks'
import { useSpring } from 'react-spring/hooks'
import { useGesture } from 'react-with-gesture'

const to = i => ({
    x: 0,
    y: 0,
    scale: 1,
    rot: Math.random() * 2,
    flip: 0,
    delay: i * 100
})
const from = i => ({ rot: 0, flip: 180, scale: 1, y: 0 })

const trans = (r, s, f) => 
    `perspective(1000px) rotate3d(1, 0, 0, 10deg) rotate3d(0, 1, 0, ${f}deg) rotate3d(0, 0, 1, ${r}deg)`

const invertFlip = (f) => (Math.sign(f) || 1) * (180 - Math.abs(f))
const backTrans = (r, s, f) => trans(r, s, (f))
const visibility = (r) => 
    Math.abs(r) > 90 ? "hidden" : "visible"
const backVisibility = (r) => visibility(invertFlip(r))

function Card({ i, cardData, onSwipe }) {
    const { title, distance, text, image } = cardData

    const [cardAnimationState, setCardAnimationState] = useSpring(() => ({
            ...to(i),
            from: from(i)
        })
    )
    
    const [isGoneState] = useState({isGone: false});

    const bind = useGesture(
        ({
            args: [index],
            down,
            delta: [xDelta],
            distance,
            direction: [xDir],
            velocity
        }) => {
            const threshold = Math.min(200, window.innerWidth / 2)
            const trigger = Math.abs(xDelta) * window.devicePixelRatio > threshold
            const dir = Math.sign(xDelta)

            if (!down && trigger && !isGoneState.isGone) {
                // Handle game state updates
                isGoneState.isGone = true;
                window.setTimeout(() => {
                    onSwipe(cardData, dir)
                }, 600)
            }
            const isGone = isGoneState.isGone;

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

    const { x, y, rot, scale, flip } = cardAnimationState

    return (
        <animated.div
            className="card-container"
            key={i}
            style={{
                position: "absolute",
                transform: interpolate(
                    [x, y],
                    (x, y) => `translate3d(${x}px,${y}px,0)`
                )
            }}>
            <animated.div
                className="card card-front"
                {...bind(i)}
                style={{
                    transform: interpolate([rot, scale, flip], trans),
                    visibility: interpolate([flip], visibility)
                }}>
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
            <animated.div
                className="card card-back"
                {...bind(i)}
                style={{
                    position: "absolute",
                    transform: interpolate([rot, scale, flip], backTrans),
                    visibility: interpolate([flip], backVisibility),
                }}>
                <div className="card-content">
                    
                </div>
            </animated.div>
        </animated.div>
    )
}

export default Card

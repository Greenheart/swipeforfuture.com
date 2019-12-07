import React from 'react'
import { animated, interpolate } from 'react-spring/hooks'

class Card extends React.Component {
    render() {
        const { i, x, y, rot, scale, trans, bind, cardData } = this.props
        const { title, distance, text, image } = cardData

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
}

export default Card

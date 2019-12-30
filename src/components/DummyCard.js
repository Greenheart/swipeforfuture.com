import React from 'react'

function DummyCard({x, y, r = 0, layer}) {
    return (
        <div
            className="card-container"
            style={{
                position: "absolute",
                transform: `translate3d(${x}px, ${y}px, 0)`,
                transition: "transform 0.1s",
                zIndex: layer
            }}>
            <div
                className="card card-back"
                style={{
                    transform: `perspective(1500px) rotate3d(1, 0, 0, 30deg) rotate3d(0, 0, 1, ${r}deg)`,
                    transition: "transform 0.1s",
                }}>
                <div className="card-content">
                    
                </div>
            </div>
        </div>
    )
}

export default DummyCard;
import React from 'react'
import styled from 'styled-components/macro'

type DummyCardProps = {
    x: number
    y: number
    r: number
    layer: number
}

type CardProps = {
    image: string
    title: string
    text: string
    location: string
}

const CardContent = styled.div`
    display: block;
    position: relative;
    width: ${(props) => props.theme.cardWidth(1)};
    height: ${(props) => props.theme.cardWidth(2)};

    will-change: transform;
    border-radius: ${(props) => props.theme.cardWidth(0.035)};
    box-shadow: 0 12.5px 20px -10px rgba(50, 50, 73, 0.4),
        0 10px 10px -10px rgba(50, 50, 73, 0.3);
    overflow: hidden;
    font-size: ${(props) => props.theme.cardWidth(0.035)};
    background: #fff;

    & > .card-image {
        width: 100%;
        height: 70%;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: auto 120%;
        border: solid ${(props) => props.theme.cardWidth(0.035)} #fff;
        border-style: solid solid none solid;
    }

    & > .card-text {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        min-height: 30%;
        background: #fff;

        & > em.location {
            position: absolute;
            top: ${(props) => props.theme.cardWidth(-0.1125)};
            right: 0;
            display: block;
            font-size: 140%;
            background: rgba(230, 230, 230, 0.7);
            border-radius: 1vh 0 0 1vh;
            padding: ${(props) => props.theme.cardWidth(0.0125)}
                ${(props) => props.theme.cardWidth(0.125)}
                ${(props) => props.theme.cardWidth(0.0125)}
                ${(props) => props.theme.cardWidth(0.05)};
        }

        & > h1.title {
            font-size: 160%;
            white-space: nowrap;
            color: #fff;
            background: #333;
            display: block;
            margin: 0;
            padding: ${(props) => props.theme.cardWidth(0.025)}
                ${(props) => props.theme.cardWidth(0.0625)};
        }

        & > p.text {
            font-size: 160%;
            color: #333;
            padding: ${(props) => props.theme.cardWidth(0.05)}
                ${(props) => props.theme.cardWidth(0.0625)}
                ${(props) => props.theme.cardWidth(0.1)}
                ${(props) => props.theme.cardWidth(0.0625)};
            margin: 0;
        }
    }

    & > .card-back {
        width: 100%;
        height: 100%;
        border: solid ${(props) => props.theme.cardWidth(0.035)} #fff;
        box-sizing: border-box;
        background: url('https://images.unsplash.com/photo-1550537687-c91072c4792d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');
        background-size: auto 100%;
        background-repeat: repeat;
        background-position: center center;
    }
`
CardContent.defaultProps = {
    theme: {
        cardWidth: (value: number) => value * 40 + 'vh',
    },
}

export const CardView: React.SFC<CardProps> = ({
    image,
    title,
    text,
    location,
}) => (
    <CardContent>
        <div
            className="card-image"
            style={{
                backgroundImage: 'url(' + (image ? image : '') + ')',
            }}
        ></div>
        <div className="card-text">
            {location && <em className="location">{location}</em>}
            <h1 className="title">{title}</h1>
            <p className="text">{text}</p>
        </div>
    </CardContent>
)

export const DummyCard: React.FunctionComponent<DummyCardProps> = ({
    x,
    y,
    r = 0,
    layer,
}) => (
    <div
        style={{
            position: 'absolute',
            left: '50%',
            transform: `translate3d(-50%, 0, 0) translate3d(${x}px, ${y}px, 0) perspective(1500px) rotate3d(1, 0, 0, 30deg) rotate3d(0, 0, 1, ${r}deg)`,
            transition: 'transform 0.1s',
            zIndex: layer,
        }}
    >
        <CardContent>
            <div className="card-back"></div>
        </CardContent>
    </div>
)

import React from 'react'
import styled from 'styled-components/macro'
import { SwipeDirection } from '../util/constants'

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
    leftAction?: string
    rightAction?: string
    direction?: SwipeDirection
}

function cardSize(
    scale: number,
): (props: { theme: { cardWidth: (s: number) => string } }) => string {
    return ({
        theme: { cardWidth },
    }: {
        theme: { cardWidth: (s: number) => string }
    }) => cardWidth(scale)
}

const borderRadius = cardSize(0.035)
const cardWidth = cardSize(1)
const cardHeight = cardSize(2)
const actionWidth = cardSize(0.5)
const minActionWidth = cardSize(0.25)
const largePadding = cardSize(0.125)
const halfLargePadding = cardSize(0.0625)
const quadPadding = cardSize(0.1)
const doublePadding = cardSize(0.05)
const mediumPadding = cardSize(0.025)
const halfPadding = cardSize(0.0125)
const locationPosition = cardSize(-0.1125)

const CardContent = styled.div`
    font-size: ${borderRadius};

    & > .action-left,
    & > .action-right {
        font-size: 160%;
        background: #fff;
        position: absolute;
        overflow: hidden;
        top: 20%;
        max-width: ${actionWidth};
        min-width: ${minActionWidth};

        padding: 0;
        opacity: 0;
        transition: transform 0.2s, opacity 0.2s;
        transform: translateX(0%) scale(0.7);
        box-shadow: 0 12.5px 20px -10px rgba(50, 50, 73, 0.4),
            0 10px 10px -10px rgba(50, 50, 73, 0.3);

        & > .description {
            padding: ${mediumPadding};
            text-align: center;
        }

        & > .arrow {
            background: #333;
            font-size: 160%;
            color: #fff;
            padding-left: ${mediumPadding};
            padding-right: ${mediumPadding};
        }
    }

    & > .action-right {
        left: 0;
        border-radius: ${borderRadius};

        & > .arrow {
            text-align: right;
        }
    }

    & > .action-left {
        right: 0;
        border-radius: ${borderRadius};
    }

    & > .action-right.active {
        transform: translateX(-50%) scale(1);
        opacity: 1;
    }

    & > .action-left.active {
        transform: translateX(50%) scale(1);
        opacity: 1;
    }

    & > .card-view {
        display: block;
        will-change: transform;
        position: relative;
        width: ${cardWidth};
        height: ${cardHeight};
        border-radius: ${borderRadius};
        box-shadow: 0 12.5px 20px -10px rgba(50, 50, 73, 0.4),
            0 10px 10px -10px rgba(50, 50, 73, 0.3);
        overflow: hidden;
        background: #fff;

        & > .card-image {
            width: 100%;
            height: 70%;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: auto 120%;
            border: solid ${borderRadius} #fff;
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
                top: ${locationPosition};
                right: 0;
                display: block;
                font-size: 140%;
                background: rgba(230, 230, 230, 0.7);
                border-radius: 1vh 0 0 1vh;
                padding: ${halfPadding} ${largePadding} ${halfPadding}
                    ${doublePadding};
            }

            & > h1.title {
                font-size: 160%;
                white-space: nowrap;
                color: #fff;
                background: #333;
                display: block;
                margin: 0;
                padding: ${mediumPadding} ${halfLargePadding};
            }

            & > p.text {
                font-size: 160%;
                color: #333;
                padding: ${doublePadding} ${halfLargePadding} ${quadPadding}
                    ${halfLargePadding};
                margin: 0;
            }
        }

        & > .card-back {
            width: 100%;
            height: 100%;
            border: solid ${borderRadius} #fff;
            box-sizing: border-box;
            background: url(${(props) => props.theme.cardBackImage});
            background-size: auto 100%;
            background-repeat: repeat;
            background-position: center center;
        }
    }
`
CardContent.defaultProps = {
    theme: {
        cardWidth: (value: number) => value * 40 + 'vh',
        cardBackImage:
            'https://images.unsplash.com/photo-1550537687-c91072c4792d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    },
}

export const CardView: React.SFC<CardProps> = ({
    image,
    title,
    text,
    location,
    leftAction,
    rightAction,
    direction,
}) => (
    <CardContent>
        <div className="card-view">
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
        </div>
        <div
            className={
                'action-left' +
                (direction === SwipeDirection.Left ? ' active' : '')
            }
        >
            <div className="description">{leftAction ?? 'No'}</div>
            <div className="arrow">&larr;</div>
        </div>
        <div
            className={
                'action-right' +
                (direction === SwipeDirection.Right ? ' active' : '')
            }
        >
            <div className="description">{rightAction ?? 'Yes'}</div>
            <div className="arrow">&rarr;</div>
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
            transform: `translate3d(-50%, 0, 0) translate3d(${x * 0.15}vh, ${
                y * 0.15
            }vh, 0) perspective(1500px) rotate3d(1, 0, 0, 30deg) rotate3d(0, 0, 1, ${r}deg)`,
            transition: 'transform 0.3s',
            zIndex: layer,
        }}
    >
        <CardContent>
            <div className="card-view">
                <div className="card-back"></div>
            </div>
        </CardContent>
    </div>
)

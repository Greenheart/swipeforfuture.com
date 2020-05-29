import {
    cardRef,
    worldQuery,
    unsplashImage,
    replaceAction,
    eventCardAction,
} from '../../content-utils'
import { ENVIRONMENT, PEOPLE, MONEY, POPULARITY, SECURITY } from './stats'
import { EventCards, WorldEvent } from '../../../src/game/ContentTypes'

const endGame = cardRef('end-game')

// IDEA: split end game events into multiple different ones depending on what triggers them.
export const endGameEvents: WorldEvent[] = [
    {
        initialEventCardId: endGame,
        isAvailableWhen: [
            worldQuery({
                [ENVIRONMENT]: [0, 0],
            }),
            worldQuery({
                [PEOPLE]: [0, 0],
            }),
            worldQuery({
                [SECURITY]: [0, 0],
            }),
            worldQuery({
                [MONEY]: [0, 0],
            }),
            worldQuery({
                [POPULARITY]: [0, 0],
            }),
        ],
        probability: 1,
    },
]

export const endGameEventCards: EventCards = {
    [endGame]: {
        image: unsplashImage('1497039465987-61d305728610'),
        title: 'The World Has Ended.',
        location: '',
        text:
            'Please find a new planet to destroy, if you want to proceed. And do not try to swipe. Please.',
        weight: 1000,
        actions: {
            left: eventCardAction(replaceAction({}, {})),
            right: eventCardAction(replaceAction({}, {})),
        },
        type: 'event',
    },
}

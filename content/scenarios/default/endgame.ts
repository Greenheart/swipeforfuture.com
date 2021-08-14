import {
    Card,
    cardRef,
    worldQuery,
    replaceModifier,
    action,
    CardPriority,
} from '../../content-utils'
import { ENVIRONMENT, PEOPLE, MONEY, POPULARITY, SECURITY } from './stats'
import image from './images'

export const endGameCards: Card[] = [
    {
        id: cardRef('endgame'),
        image: image('desert'),
        title: 'The World Has Ended.',
        location: '',
        text: "Wow, that's NOT how you do it! Please find a new planet to destroy...",
        weight: 1000,
        actions: {
            left: action(replaceModifier({}, {}), "Sorry, not sorry!"),
            right: action(replaceModifier({}, {}), "Hah, we'll find another one!"),
        },
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
        priority: CardPriority.Event,
    },
]

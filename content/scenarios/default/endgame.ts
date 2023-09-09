import {
    Card,
    cardRef,
    worldQuery,
    replaceModifier,
    action,
    CardPriority,
} from '../../content-utils/index.js'
import { ENVIRONMENT, PEOPLE, MONEY, POPULARITY, SECURITY } from './stats.js'
import image from './images.js'

export const endGameCards: Card[] = [
    {
        id: cardRef('endgame'),
        image: image('desert'),
        title: 'The World Has Ended.',
        location: '',
        text: "Wow, that's NOT how you do it! Please find a new planet to destroy...",
        weight: 1000,
        actions: {
            left: action(
                replaceModifier({}),
                'Sorry, not sorry!',
                undefined,
                'unknown',
            ),
            right: action(
                replaceModifier({}),
                "Hah, we'll find another one!",
                undefined,
                'unknown',
            ),
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

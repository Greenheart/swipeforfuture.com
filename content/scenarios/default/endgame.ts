import {
    Card,
    cardRef,
    worldQuery,
    unsplashImage,
    replaceModifier,
    action,
    CardPriority,
} from '../../content-utils'
import { ENVIRONMENT, PEOPLE, MONEY, POPULARITY, SECURITY } from './stats'

export const endGameCards: Card[] = [
    {
        id: cardRef('end-game'),
        image: unsplashImage('1497039465987-61d305728610'),
        title: 'The World Has Ended.',
        location: '',
        text: 'Please find a new planet to destroy, if you want to proceed. And do not try to swipe. Please.',
        weight: 1000,
        actions: {
            left: action(replaceModifier({}, {}), "Sorry, not sorry!"),
            right: action(replaceModifier({}, {}), 'Again!'),
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
        priority: CardPriority.Card,
    },
]

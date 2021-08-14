import {
    Card,
    worldQuery,
    action,
    addModifier,
    cardRef,
    CardPriority,
    showOnlyOnce,
} from '../../content-utils'
import { ENVIRONMENT, MONEY, PEOPLE, SECURITY, POPULARITY } from './stats'
import VARS from './vars'
import image from './images'

export const otherCards: Card[] = [
    showOnlyOnce({
        id: cardRef('solar-ready'),
        image: image('powerplant', 'solar'),
        title: 'Our solar project is ready!',
        location: 'The greener other side',
        text: 'Congratulations! Thanks to your ambitions investments, we beat the initial German energy expansion ⚡️',
        weight: 500,
        isAvailableWhen: [
            worldQuery({
                [VARS.SOLAR_INVESTMENTS]: [1, 1],
                [VARS.INFRAN_INIT]: 1,
            }),
        ],
        actions: {
            left: action(
                addModifier({
                    [ENVIRONMENT]: 30,
                    [PEOPLE]: 15,
                    [SECURITY]: 15,
                    [MONEY]: 5,
                    [POPULARITY]: 20,
                }),
                'Nice work!',
            ),
            right: action(
                addModifier({
                    [ENVIRONMENT]: 30,
                    [PEOPLE]: 15,
                    [SECURITY]: 15,
                    [MONEY]: 5,
                    [POPULARITY]: 20,
                }),
                'Great news!',
            ),
        },
        priority: CardPriority.Card,
    }),
    showOnlyOnce({
        id: cardRef('coal-sale'),
        image: image('powerplant', 'coal'),
        title: 'Cheap but dirty brown coal for sale',
        location: 'Working class district',
        text: 'We\'ve got an interesting offer: Buy a "modern" brown coal power plant cheaply to generate electricity. Deal? Great!',
        weight: 500,
        isAvailableWhen: [
            worldQuery({
                [ENVIRONMENT]: [21, 100],
                [MONEY]: [15, 100],
                [VARS.BROWN_COAL_PLANT]: 0,
            }),
        ],
        actions: {
            left: action(
                addModifier({
                    [ENVIRONMENT]: 10,
                    [PEOPLE]: 10,
                    [SECURITY]: 15,
                    [MONEY]: -5,
                    [POPULARITY]: 25,
                }),
                'No way, shut it down!',
            ),
            right: action(
                addModifier({
                    [ENVIRONMENT]: -20,
                    [PEOPLE]: -15,
                    [SECURITY]: -10,
                    [MONEY]: 40,
                    [POPULARITY]: -20,

                    [VARS.BROWN_COAL_PLANT]: 1,
                }),
                "Sweet! We'll get rich",
            ),
        },
        priority: CardPriority.Card,
    }),
]

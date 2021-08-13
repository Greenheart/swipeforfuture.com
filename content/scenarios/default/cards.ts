import {
    Card,
    worldQuery,
    unsplashImage,
    pexelsImage,
    action,
    addModifier,
    cardRef,
    CardPriority,
    showOnlyOnce,
} from '../../content-utils'
import { ENVIRONMENT, MONEY, PEOPLE, SECURITY, POPULARITY } from './stats'
import { VARS } from './vars'
import { FLAGS } from './flags'

export const otherCards: Card[] = [
    showOnlyOnce({
        id: cardRef('solar-ready'),
        image: unsplashImage('1497435334941-8c899ee9e8e9'),
        title: 'Our solar project is ready!',
        location: 'The greener other side',
        text: 'Congratulations! Thanks to your ambitions investments, we beat the initial German energy expansion ⚡️',
        weight: 30,
        isAvailableWhen: [
            worldQuery(
                {
                    [VARS.SOLAR_INVESTMENTS]: [1, 1],
                },
                {
                    [FLAGS.INFRAN_INIT]: true,
                },
            ),
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
        image: pexelsImage('3044473'),
        title: 'Cheap but dirty brown coal for sale',
        location: 'Working class district',
        text: "We've got an interesting offer: Buy a \"modern\" brown coal power plant cheaply to generate electricity. Deal? Great!",
        weight: 30,
        isAvailableWhen: [
            worldQuery({
                [ENVIRONMENT]: [21, 100],
                [MONEY]: [15, 100],
            }, {
                [FLAGS.BROWN_COAL_PLANT]: false,
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
                'No way, shut it down!'
            ),
            right: action(
                addModifier({
                    [ENVIRONMENT]: -20,
                    [PEOPLE]: -15,
                    [SECURITY]: -10,
                    [MONEY]: 40,
                    [POPULARITY]: -20,
                    
                }, {
                    [FLAGS.BROWN_COAL_PLANT]: true,
                }),
                "Sweet! We'll get rich"
            ),
        },
        priority: CardPriority.Card,
    }),
]

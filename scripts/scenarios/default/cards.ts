import { CardData } from '../../../src/game/ContentTypes'
import {
    worldQuery,
    addAction,
    unsplashImage,
    pexelsImage,
} from '../../content-utils'
import { ENVIRONMENT, MONEY, PEOPLE, SECURITY, POPULARITY } from './stats'
import { VARS } from './vars'
import { FLAGS } from './flags'

export const otherCards: CardData[] = [
    {
        type: 'card',
        image: unsplashImage('1544513566-b4de3719ee70'),
        title: 'Extreme weather disaster',
        location: 'South-east Asia',
        text:
            'Some of our allied countries were just hit by extreme weather. Entire cities were wiped out. They need help with disaster relief. Should we increase our foreign aid budget and help them?',
        weight: 100,
        isAvailableWhen: [
            worldQuery({
                [ENVIRONMENT]: [0, 40],
            }),
        ],
        actions: {
            left: addAction({
                [PEOPLE]: -10,
                [SECURITY]: -13,
                [MONEY]: 5,
                [POPULARITY]: -10,
            }),
            right: addAction({
                [ENVIRONMENT]: 20,
                [PEOPLE]: 10,
                [SECURITY]: 8,
                [MONEY]: -15,
                [POPULARITY]: 25,
            }),
        },
    },
    {
        type: 'card',
        image: unsplashImage('1497435334941-8c899ee9e8e9'),
        title: 'Our solar project is ready!',
        location: 'The greener other side',
        text:
            'Congratulations! We beat the initial German energy expansion ⚡️',
        weight: 100,
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
            left: addAction({
                [ENVIRONMENT]: 30,
                [PEOPLE]: 15,
                [SECURITY]: 15,
                [MONEY]: 5,
                [POPULARITY]: 20,
                [VARS.SOLAR_INVESTMENTS]: 100,
            }),
            right: addAction({
                [ENVIRONMENT]: 30,
                [PEOPLE]: 15,
                [SECURITY]: 15,
                [MONEY]: 5,
                [POPULARITY]: 20,
                [VARS.SOLAR_INVESTMENTS]: 100,
            }),
        },
    },
    {
        type: 'card',
        image: pexelsImage('3044473'),
        title: 'Cheap but dirty brown coal for sale',
        location: 'Working class district',
        text:
            "We've got an interesting offer: Buy a modern brown coal power plant cheaply to generate electricity. Deal? Great! (WATCH OUT FOR ENVIRA though...)",
        weight: 100,
        isAvailableWhen: [
            worldQuery({
                [ENVIRONMENT]: [21, 100],
                [MONEY]: [15, 100],
                [VARS.BROWN_COAL_PLANTS]: [0, 0],
            }),
        ],
        actions: {
            left: addAction({
                [ENVIRONMENT]: 10,
                [PEOPLE]: 10,
                [SECURITY]: 15,
                [MONEY]: -5,
                [POPULARITY]: 25,
                [VARS.BROWN_COAL_PLANTS]: 0,
            }),
            right: addAction({
                [ENVIRONMENT]: -20,
                [PEOPLE]: -15,
                [SECURITY]: -10,
                [MONEY]: 40,
                [POPULARITY]: -20,
                [VARS.BROWN_COAL_PLANTS]: 1,
            }),
        },
    },
]

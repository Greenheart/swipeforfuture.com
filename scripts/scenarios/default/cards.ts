import { CardData } from '../../../src/game/ContentTypes'
import { worldQuery, addAction } from '../../content-utils'
import { ENVIRONMENT, MONEY, PEOPLE, SECURITY, POPULARITY } from './stats'
import { VARS } from './vars'

export const otherCards: CardData[] = [
    {
        type: 'card',
        image:
            'https://images.pexels.com/photos/3044473/pexels-photo-3044473.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300',
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

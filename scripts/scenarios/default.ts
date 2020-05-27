// GOAL: Recreate the default game world from the JSON data folder, using content-utils
// With this goal, we will know what content-utils we need to develop to create a good developer experience

import { CardData } from '../../src/game/ContentTypes'
import {
    createCardTemplate,
    createCardFromTemplate,
    unsplashImage,
} from '../content-utils'

const cardTemplates: { [id: string]: CardData } = {
    infran: createCardTemplate({
        image: unsplashImage('1529088746738-c4c0a152fb2c'),
        location: 'On the phone',
        weight: 1,
    }),
    envira: createCardTemplate({
        image: unsplashImage('1546541612-82d19b258cd5'),
        location: 'Outside parliament',
        weight: 1,
    }),
    cat: createCardTemplate({
        image: unsplashImage('1548247416-ec66f4900b2e'),
        location: 'Outside parliament',
        weight: 1,
    }),
}

const stats = ['environment', 'people', 'security', 'money', 'popularity']

const catastrophicCards = stats.map<CardData>((stat) => {
    const partial: Partial<CardData> = {
        title: `Look at me! I'm ${stat.toUpperCase()} Cat`,
        location: '',
        text:
            'Your cat needs some love and tenderness. Try to make time in your busy schedule',
        isAvailableWhen: [
            {
                state: {
                    [stat]: [0, 100],
                },
            },
        ],
        actions: {
            left: {
                modifier: {
                    type: 'add',
                    state: {
                        [stat]: -10,
                    },
                    flags: {},
                },
            },
            right: {
                modifier: {
                    type: 'add',
                    state: {
                        [stat]: 10,
                    },
                    flags: {},
                },
            },
        },
    }
    return createCardFromTemplate(cardTemplates.cat, partial)
})

// GOAL: Recreate the default game world from the JSON data folder, using content-utils
// With this goal, we will know what content-utils we need to develop to create a good developer experience

import { CardData } from '../../src/game/ContentTypes'
import {
    createCardTemplate,
    createCardFromTemplate,
    unsplashImage,
    stat,
    ScenarioBuilder,
    Scenario,
} from '../content-utils'

const STATS = {
    environment: stat('Environment', 'GiWheat', '70%'),
    people: stat('People', 'IoIosPeople'),
    security: stat('Security', 'GiAk47'),
    money: stat('Money', 'GiMoneyStack'),
    popularity: stat('Popularity', 'FiSmile', '70%'),
}
const ENVIRONMENT = STATS.environment.id
const PEOPLE = STATS.people.id
const SECURITY = STATS.security.id
const MONEY = STATS.money.id
const POPULARITY = STATS.popularity.id

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

const statIds = Object.values(STATS).map((stat) => stat.id)
const catastrophicCards = statIds.map<CardData>((stat) => {
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

const builder: ScenarioBuilder = {
    run() {
        const scenario: Scenario = {
            id: 'default',
            stats: Object.values(STATS),
            cards: [...catastrophicCards],
            events: [],
            eventCards: {},
            defaultState: {
                state: {
                    [ENVIRONMENT]: 40,
                    [PEOPLE]: 60,
                    [SECURITY]: 75,
                    [MONEY]: 90,
                    [POPULARITY]: 53,
                },
                flags: {},
            },
        }
        return scenario
    },
}

export default builder

// GOAL: Recreate the default game world from the JSON data folder, using content-utils
// With this goal, we will know what content-utils we need to develop to create a good developer experience

import { CardData } from '../../src/game/ContentTypes'
import {
    createCardTemplate,
    createCardFromTemplate,
    unsplashImage,
    addAction,
    stat,
    ScenarioBuilder,
    Scenario,
    worldQuery,
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

const VARS = {
    BROWN_COAL_PLANT: 'brown-coal-plant',
}

const statIds = Object.values(STATS).map((stat) => stat.id)
const catastrophicCards = statIds.map<CardData>((stat) => {
    const partial: Partial<CardData> = {
        title: `Look at me! I'm ${stat.toUpperCase()} Cat`,
        location: '',
        text:
            'Your cat needs some love and tenderness. Try to make time in your busy schedule',
        isAvailableWhen: [
            worldQuery({
                [stat]: [0, 100],
            }),
        ],
        actions: {
            left: addAction({ [stat]: -10 }),
            right: addAction({ [stat]: 10 }),
        },
    }
    return createCardFromTemplate(cardTemplates.cat, partial)
})

const enviraCards = []

const infranCards = []

const otherCards = [
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
                [VARS.BROWN_COAL_PLANT]: [0, 0],
            }),
        ],
        actions: {
            left: addAction({
                [ENVIRONMENT]: 10,
                [PEOPLE]: 10,
                [SECURITY]: 15,
                [MONEY]: -5,
                [POPULARITY]: 25,
                [VARS.BROWN_COAL_PLANT]: 0,
            }),
            right: addAction({
                [ENVIRONMENT]: -20,
                [PEOPLE]: -15,
                [SECURITY]: -10,
                [MONEY]: 40,
                [POPULARITY]: -20,
                [VARS.BROWN_COAL_PLANT]: 1,
            }),
        },
    },
]

const builder: ScenarioBuilder = {
    run() {
        const scenario: Scenario = {
            id: 'default',
            stats: Object.values(STATS),
            cards: [...catastrophicCards, ...enviraCards, ...infranCards],
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

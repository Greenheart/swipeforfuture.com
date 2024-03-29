import {
    Scenario,
    getDynamicVars,
    getScenarioId,
} from '../../content-utils/index.js'
import {
    ENVIRONMENT,
    PEOPLE,
    SECURITY,
    MONEY,
    POPULARITY,
    STATS,
} from './stats.js'

import cards from './cards.js'

const scenario: Scenario = {
    id: getScenarioId(import.meta.url),
    stats: Object.values(STATS),
    cards: [...cards],
    defaultState: {
        state: {
            [ENVIRONMENT]: 40,
            [PEOPLE]: 60,
            [SECURITY]: 75,
            [MONEY]: 55,
            [POPULARITY]: 53,
            ...getDynamicVars(),
        },
    },
    worldStateModifiers: [
        {
            type: 'round',
        },
        {
            type: 'cycle',
            id: 'hourOfDay',
            length: 24,
        },
        {
            type: 'debug',
        },
    ],
}

export default scenario

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

import VARS from './vars.js'

import { catastrophicCards } from './cat.js'
import { enviraCards } from './envira.js'
import { infranCards } from './infran.js'
import { otherCards } from './cards.js'
import { endGameCards } from './endgame.js'
import { mariaCards } from './maria.js'
import { environmentalInitiativeCards } from './environmental-initiatives.js'

const scenario: Scenario = {
    id: getScenarioId(import.meta.url),
    stats: Object.values(STATS),
    cards: [
        ...catastrophicCards,
        ...enviraCards,
        ...infranCards,
        ...otherCards,
        ...environmentalInitiativeCards,
        ...mariaCards,
        ...endGameCards,
        ...infranCards,
        ...enviraCards,
    ],
    defaultState: {
        state: {
            [ENVIRONMENT]: 40,
            [PEOPLE]: 60,
            [SECURITY]: 75,
            [MONEY]: 55,
            [POPULARITY]: 53,
            [VARS.ROADS_SUGGESTED]: 0,
            [VARS.ROAD_EXPANSION]: 0,
            [VARS.SOLAR_INVESTMENTS]: 0,
            [VARS.LUNCH_MEETING_COMPLETED]: 0,
            [VARS.ENVIRA_INIT]: 0,
            [VARS.INFRAN_INIT]: 0,
            [VARS.BROWN_COAL_PLANT]: 0,
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

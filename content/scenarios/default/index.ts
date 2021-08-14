import { Scenario, getDynamicFlags, getScenarioId } from '../../content-utils'
import {
    ENVIRONMENT,
    PEOPLE,
    SECURITY,
    MONEY,
    POPULARITY,
    STATS,
} from './stats'

import { VARS } from './vars'
import { FLAGS } from './flags'

import { catastrophicCards } from './cat'
import { enviraCards } from './envira'
import { infranCards } from './infran'
import { otherCards } from './cards'
import { endGameCards } from './endgame'
import { mariaCards } from './maria'
import { environmentalInitiativeCards } from './environmental-initiatives'

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
        },
        flags: {
            [FLAGS.LUNCH_MEETING_COMPLETED]: false,
            [FLAGS.ENVIRA_INIT]: false,
            [FLAGS.INFRAN_INIT]: false,
            [FLAGS.BROWN_COAL_PLANT]: false,
            ...getDynamicFlags(),
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

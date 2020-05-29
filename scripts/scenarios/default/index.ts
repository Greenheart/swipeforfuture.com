// GOAL: Recreate the default game world from the JSON data folder, using content-utils
// With this goal, we will know what content-utils we need to develop to create a good developer experience

import { ScenarioBuilder, Scenario } from '../../content-utils'
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
import { enviraCards, enviraEventCards } from './envira'
import { infranCards, infranEventCards, infranEvents } from './infran'
import { otherCards } from './cards'
import { endGameEventCards, endGameEvents } from './endgame'
import { mariaEventCards, mariaEvents } from './maria'

export const builder: ScenarioBuilder = {
    run() {
        const scenario: Scenario = {
            id: 'default',
            stats: Object.values(STATS),
            cards: [
                ...catastrophicCards,
                ...enviraCards,
                ...infranCards,
                ...otherCards,
            ],
            events: [
                ...mariaEvents,
                ...endGameEvents,
                ...infranEvents,
                ...mariaEvents,
            ],
            eventCards: {
                ...mariaEventCards,
                ...endGameEventCards,
                ...enviraEventCards,
                ...infranEventCards,
            },
            // TODO: add full default state
            defaultState: {
                state: {
                    [ENVIRONMENT]: 40,
                    [PEOPLE]: 60,
                    [SECURITY]: 75,
                    [MONEY]: 55,
                    [POPULARITY]: 53,
                    [VARS.BROWN_COAL_PLANTS]: 0,
                },
                flags: { [FLAGS.LUNCH_MEETING_COMPLETED]: false },
            },
        }
        return scenario
    },
}

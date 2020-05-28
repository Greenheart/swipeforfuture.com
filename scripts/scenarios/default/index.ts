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
} from './common'

import { catastrophicCards } from './cat'
import { enviraCards } from './envira'
import { infranCards } from './infran'
import { otherCards } from './cards'
import { mariaEventCards } from './maria'

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
            events: [],
            eventCards: {
                ...mariaEventCards,
            },
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

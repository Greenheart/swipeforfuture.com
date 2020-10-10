import { ScenarioBuilder, Scenario } from '../../content-utils'

export const builder: ScenarioBuilder = {
    run() {
        const scenario: Scenario = {
            id: 'road-to-utopia',
            stats: [],
            cards: [],
            events: [],
            eventCards: {},
            defaultState: {
                state: {},
                flags: {},
            },
            worldStateModifiers: [],
        }
        return scenario
    },
}

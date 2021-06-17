import * as Stats from "./stats"
import {
    loadStandardFile,
    toCardData,
} from "./from-data"

import {
    Scenario,
    combineDefaultEntries,
} from "../content-utils"
export const builder = {
    run(data: any) {
        const rawData = loadStandardFile(data, undefined)
        const cards = toCardData(rawData)
        const scenario: Scenario = {
            id: "donuts",
            stats: Object.values(Stats.definitions),
            cards: [...cards],
            events: [],
            eventCards: {},
            defaultState: {
                state: combineDefaultEntries([...Stats.defaultStates]),
                flags: combineDefaultEntries([...Stats.defaultFlags]),
            },
            worldStateModifiers: [
                {
                    type: "round",
                },
                {
                    type: "cycle",
                    id: "daycycle",
                    length: 4,
                },
                {
                    type: "debug",
                },
            ],
        }
        return scenario
    },
}

import { stat, defaultState, defaultFlag } from "../content-utils"
import {
    imageDB,
    imageEntry,
} from "../content-utils"
import {
    loadCharacters,
    loadStandardFile,
    loadParams,
    loadFlags,
    toCardData,
} from "./from-data"

import {
    Scenario,
    combineDefaultEntries,
} from "../content-utils"
export const builder = {
    run(data: any) {
        const rawData = loadStandardFile(data)
        const characterData = loadCharacters(data)
        console.log(characterData)
        const paramData = loadParams(data)
        console.log(paramData)
        const flagData = loadFlags(data)
        console.log(flagData)
        const stats = paramData.filter(param => param.Icon).map(
            param => stat(
                param.Name,
                param.Icon!,
                param.IconSize === undefined ? "100%" : param.IconSize + "%"
            )
        )
        const defaultStates = paramData.map(param => defaultState(param.Name, param.Value))
        const defaultFlags = flagData.map(flag => defaultFlag(flag.Name, flag.Value))
        const { getImage } = imageDB(
            characterData.map(char => (
                imageEntry(char.Source, char.Name)
            ))
        )
        const cards = toCardData(rawData, getImage)
        const scenario: Scenario = {
            id: "donuts",
            stats: stats,
            cards: [...cards],
            events: [],
            eventCards: {},
            defaultState: {
                state: combineDefaultEntries(defaultStates),
                flags: combineDefaultEntries(defaultFlags),
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

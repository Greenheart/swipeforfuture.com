import {
    stat,
    defaultState,
    imageDB,
    imageEntry,
    Scenario,
    combineDefaultEntries,
} from "."
import {
    loadCharacters,
    loadStandardFile,
    loadParams,
    loadFlags,
    toCardData,
} from "./from-data"
import {
    Flag
} from "./utils"

export function parseScenario(
    data: any,
    scenarioId: string = "xlsx-scenario"
) {
    const rawData = loadStandardFile(data)
    const characterData = loadCharacters(data)
    const paramData = loadParams(data)
    const flagData = loadFlags(data)
    const stats = paramData.filter(param => param.Icon).map(
        param => stat(
            param.Name,
            0,
            100,
            param.Icon!,
            param.IconSize === undefined ? "100%" : param.IconSize + "%"
        )
    )
    const defaultStates = [
        ...paramData.map(param => defaultState(param.Name, param.Value)),
        ...flagData.map(flag => defaultState(
            flag.Name,
            flag.Value ? Flag.True : Flag.False
        ))
    ]
    const { image } = imageDB(
        characterData.map(char => (
            imageEntry(char.Name, char.Source)
        ))
    )
    const cards = toCardData(rawData, image)
    const scenario: Scenario = {
        id: scenarioId,
        stats: stats,
        cards: [...cards],
        defaultState: {
            state: combineDefaultEntries(defaultStates),
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
                stateIds: paramData.filter(p => p.Debug).map(p => p.Name)
            },
        ],
    }
    return scenario
}

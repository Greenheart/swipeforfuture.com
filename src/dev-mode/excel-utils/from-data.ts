import {
    loadFile,
    toString,
    toNumber,
    toStringArray,
    toLowerCaseString,
} from "../content-utils/xlsx-utils"
import {
    CardData,
    BaseCard,
    cardContent,
    createIdContext,
    GameWorldModifier,
    WorldQuery,
} from "../content-utils"
import { createLinkContext } from "./utils"

const { linkLogic } = createLinkContext(createIdContext("from-data"))

type CardDescription = {
    "Card Name": string
    "Card Type": string
    Character: string
    "Text of card": string
    "Swipe Left Text": string
    "Swipe Right Text": string
    "Image Desc": string
    "Left Effect": string[]
    "Right Effect": string[]
    "Left Step"?: string
    "Right Step"?: string
    Location: string
    Title: string
    When: string[]
    Require: string[]
    Weight: number
}

type FlagDescription = {
    Name: string
    Value: boolean
}

type StateDescription = {
    Name: string
    Icon?: string
    IconSize?: number
    Value: number
}

type CharacterDescription = {
    Name: string
    Source: string
}

export function loadCharacters(data: any) {
    return loadFile<CharacterDescription>(
        data,
        {
            "Name": toString(""),
            "Source": toString(""),
        },
        {
            sheetIds: ["_characters"],
        },
    )
}

export function loadStandardFile(
    data: any,
    sheetIds?: string[]
): CardDescription[] {
    return loadFile<CardDescription>(
        data,
        {
            "Card Name": toLowerCaseString(""),
            "Card Type": toString(""),
            Character: toString(""),
            "Text of card": toString(""),
            "Swipe Left Text": toString(""),
            "Swipe Right Text": toString(""),
            "Image Desc": toString(""),
            "Left Effect": toStringArray(";", toLowerCaseString("")),
            "Right Effect": toStringArray(";", toLowerCaseString("")),
            "Left Step": toLowerCaseString(undefined),
            "Right Step": toLowerCaseString(undefined),
            Location: toString(""),
            Title: toString(""),
            When: toStringArray(";", toLowerCaseString("")),
            Require: toStringArray(";", toLowerCaseString("")),
            Weight: toNumber,
        },
        {
            sheetIds,
            sheetFilter: (key) => key[0] !== "_",
        },
    )
}

function parseGameWorldModifiers(data: string[]): GameWorldModifier[] {
    type Operation = { id: string; value: number | boolean }
    const operations = data.reduce<{
        add: Operation[]
        set: Operation[]
        replace: Operation[]
        _unknown: string[]
    }>(
        (acc, entry) => {
            const match = entry.match(
                /(\w+)\s*(\+|-|=|==)\s*(([-]?\d+)|(true|false))/,
            )
            if (match) {
                const separator = match[2]
                const value =
                    match[3] === "true"
                        ? true
                        : match[3] === "false"
                        ? false
                        : (separator === "-" ? -1 : 1) * parseFloat(match[3])
                const type: "add" | "set" | "replace" =
                    {
                        "+": "add" as "add",
                        "-": "add" as "add",
                        "=": "set" as "set",
                        "==": "replace" as "replace",
                    }[separator] || "set"
                acc[type].push({
                    id: match[1],
                    value: value,
                })
            } else {
                acc._unknown.push(entry)
            }
            return acc
        },
        { add: [], set: [], replace: [], _unknown: [] },
    )

    if (operations._unknown.length > 0) {
        console.warn(operations._unknown)
    }

    const mods: GameWorldModifier[] = [
        "add" as "add",
        "set" as "set",
        "replace" as "replace",
    ]
        .filter((type) => operations[type].length > 0)
        .map((type) => {
            const ops = operations[type]
            return {
                type: type,
                state: ops
                    .filter(
                        (o): o is { id: string; value: number } =>
                            typeof o.value === "number",
                    )
                    .reduce<{ [x: string]: number }>((acc, entry) => {
                        acc[entry.id] = entry.value
                        return acc
                    }, {}),
                flags: ops
                    .filter(
                        (o): o is { id: string; value: boolean } =>
                            typeof o.value === "boolean",
                    )
                    .reduce<{ [x: string]: boolean }>((acc, entry) => {
                        acc[entry.id] = entry.value
                        return acc
                    }, {}),
            }
        })
    return mods
}

function parseWorldQuery(data: string): WorldQuery | undefined {
    type WQState = {
        [x: string]: [number, number]
    }
    type WQFlag = {
        [x: string]: boolean
    }
    const dataEntries = data.split(",").map((e) => e.trim())
    const entries = dataEntries
        .map<WQState | undefined>((e) => {
            const match = e.match(/(\w+)\s*=\s*(\d+)\s*-\s*(\d+)/)
            if (match) {
                return {
                    [match[1]]: [parseFloat(match[2]), parseFloat(match[3])],
                }
            }
            return undefined
        })
        .filter((e): e is WQState => e !== undefined)
    const flags = dataEntries
        .map<WQFlag | undefined>((e) => {
            const match = e.match(/(\w+)\s*=\s*(true|false)/)
            if (match) {
                return {
                    [match[1]]: match[2] === "true",
                }
            }
            return undefined
        })
        .filter((e): e is WQFlag => e !== undefined)

    if (entries.length === 0 && flags.length === 0) return undefined

    const wq = {
        ...entries.reduce<WorldQuery>(
            (acc, entry) => {
                acc.state = {
                    ...acc.state,
                    ...entry,
                }
                return acc
            },
            { state: {} },
        ),
        ...flags.reduce<WorldQuery>(
            (acc, entry) => {
                acc.flags = {
                    ...acc.flags,
                    ...entry,
                }
                return acc
            },
            { flags: {} },
        ),
    }
    return wq
}

export function toCardData(
    data: CardDescription[],
    getImage: (id: string, variant?: string) => string
): CardData[] {
    const cardMap = data.reduce((acc, entry) => {
        const card = cardContent(
            getImage(entry["Character"]),
            entry["Title"],
            entry["Text of card"],
            entry["Location"],
            [entry["Swipe Left Text"], entry["Swipe Right Text"]],
        )
        acc.set(card, entry)
        return acc
    }, new Map<BaseCard, CardDescription>())

    const cardIdMap = Array.from(cardMap.entries()).reduce(
        (acc, [card, entry]) => {
            acc.set(entry["Card Name"], card)
            return acc
        },
        new Map<string, BaseCard>(),
    )

    const cards = Array.from(cardMap.entries()).map(([card, entry]) => {
        const left = entry["Left Step"]
            ? cardIdMap.get(entry["Left Step"])
            : undefined
        const right = entry["Right Step"]
            ? cardIdMap.get(entry["Right Step"])
            : undefined
        return linkLogic(
            card,
            entry["When"]
                .map((q) => parseWorldQuery(q))
                .filter((q): q is WorldQuery => q !== undefined),
            [
                [
                    ...parseGameWorldModifiers(entry["Left Effect"]),
                    { next: left },
                ],
                [
                    ...parseGameWorldModifiers(entry["Right Effect"]),
                    { next: right },
                ],
            ],
            entry.Weight,
            entry["Require"]
                .map((q) => parseWorldQuery(q))
                .filter((q): q is WorldQuery => q !== undefined),
        )
    })
    return cards
}

import {
    loadFile,
    toString,
    toNumber,
    toStringArray,
    toBoolean,
    toLowerCaseString,
} from './xlsx-utils'
import {
    Card,
    BaseCard,
    cardContent,
    createIdContext,
    GameWorldModifier,
    WorldQuery,
} from './index.js'
import { createLinkContext, Flag } from './utils.js'

const { linkLogic } = createLinkContext(createIdContext('from-data'))

type CardDescription = {
    'Card Name': string
    'Card Type': string
    Character: string
    'Text of card': string
    'Swipe Left Text': string
    'Swipe Right Text': string
    'Image Desc': string
    'Left Effect': string[]
    'Right Effect': string[]
    'Left Step'?: string
    'Right Step'?: string
    Location: string
    Title: string
    When: string[]
    Require: string[]
    Weight: number
}

type FlagDescription = {
    Name: string
    Value: boolean
    Debug: boolean
}

type StateDescription = {
    Name: string
    Icon?: string
    IconSize?: number
    Value: number
    Debug: boolean
}

type CharacterDescription = {
    Name: string
    Source: string
}

export function loadCharacters(data: any) {
    return loadFile<CharacterDescription>(
        data,
        {
            Name: toString(''),
            Source: toString(''),
        },
        {
            sheetIds: ['_characters'],
        },
    )
}

export function loadParams(data: any) {
    return loadFile<StateDescription>(
        data,
        {
            Name: toLowerCaseString(''),
            Value: toNumber,
            Icon: toString(undefined),
            IconSize: toNumber,
            Debug: toBoolean,
        },
        {
            sheetIds: ['_params'],
        },
    )
}

export function loadFlags(data: any) {
    return loadFile<FlagDescription>(
        data,
        {
            Name: toLowerCaseString(''),
            Value: toBoolean,
            Debug: toBoolean,
        },
        {
            sheetIds: ['_flags'],
        },
    )
}

export function loadStandardFile(
    data: any,
    sheetIds?: string[],
): CardDescription[] {
    return loadFile<CardDescription>(
        data,
        {
            'Card Name': toLowerCaseString(''),
            'Card Type': toString(''),
            Character: toString(''),
            'Text of card': toString(''),
            'Swipe Left Text': toString(''),
            'Swipe Right Text': toString(''),
            'Image Desc': toString(''),
            'Left Effect': toStringArray(';', toLowerCaseString('')),
            'Right Effect': toStringArray(';', toLowerCaseString('')),
            'Left Step': toLowerCaseString(undefined),
            'Right Step': toLowerCaseString(undefined),
            Location: toString(''),
            Title: toString(''),
            When: toStringArray(';', toLowerCaseString('')),
            Require: toStringArray(';', toLowerCaseString('')),
            Weight: toNumber,
        },
        {
            sheetIds,
            sheetFilter: (key) => key[0] !== '_',
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
                    match[3] === 'true'
                        ? true
                        : match[3] === 'false'
                        ? false
                        : (separator === '-' ? -1 : 1) * parseFloat(match[3])
                const type: 'add' | 'set' | 'replace' =
                    {
                        '+': 'add' as 'add',
                        '-': 'add' as 'add',
                        '=': 'set' as 'set',
                        '==': 'replace' as 'replace',
                    }[separator] || 'set'
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
        'add' as 'add',
        'set' as 'set',
        'replace' as 'replace',
    ]
        .filter((type) => operations[type].length > 0)
        .map((type) => {
            const ops = operations[type]
            return {
                type: type,
                state: ops.reduce<{ [x: string]: number }>((acc, entry) => {
                    acc[entry.id] =
                        typeof entry.value === 'boolean'
                            ? entry.value
                                ? Flag.True
                                : Flag.False
                            : entry.value
                    return acc
                }, {}),
            }
        })
    return mods
}

function parseWorldQuery(data: string): WorldQuery | undefined {
    type WQState = {
        [x: string]: [number, number] | number
    }
    const dataEntries = data.split(',').map((e) => e.trim())
    const entries = dataEntries
        .map<WQState | undefined>((e) => {
            const match = e.match(/(\w+)\s*=\s*(\d+)\s*-\s*(\d+)/)
            if (match) {
                return {
                    [match[1]]: [parseFloat(match[2]), parseFloat(match[3])],
                }
            } else {
                const match = e.match(/(\w+)\s*=\s*(true|false)/)
                if (match) {
                    const value = match[2] === 'true' ? Flag.True : Flag.False
                    return {
                        [match[1]]: [value, value],
                    }
                }
            }
            return undefined
        })
        .filter((e): e is WQState => e !== undefined)

    if (entries.length === 0) return undefined

    const wq = entries.reduce<WorldQuery>(
        (acc, entry) => {
            acc.state = {
                ...acc.state,
                ...entry,
            }
            return acc
        },
        { state: {} },
    )
    return wq
}

export function toCardData(
    data: CardDescription[],
    getImage: (id: string, variant?: string) => string,
): Card[] {
    const cardMap = data.reduce((acc, entry) => {
        const card = cardContent(
            entry['Card Name'],
            getImage(entry['Character']),
            entry['Title'],
            entry['Text of card'],
            entry['Location'],
            [entry['Swipe Left Text'], entry['Swipe Right Text']],
        )
        acc.set(card, entry)
        return acc
    }, new Map<BaseCard, CardDescription>())

    const cardIdMap = Array.from(cardMap.entries()).reduce(
        (acc, [card, entry]) => {
            acc.set(entry['Card Name'], card)
            return acc
        },
        new Map<string, BaseCard>(),
    )

    const cards = Array.from(cardMap.entries()).map(([card, entry]) => {
        const left = entry['Left Step']
            ? cardIdMap.get(entry['Left Step'])
            : undefined
        const right = entry['Right Step']
            ? cardIdMap.get(entry['Right Step'])
            : undefined
        return linkLogic(
            card,
            entry['When']
                .map((q) => parseWorldQuery(q))
                .filter((q): q is WorldQuery => q !== undefined),
            [
                [
                    ...parseGameWorldModifiers(entry['Left Effect']),
                    { next: left },
                ],
                [
                    ...parseGameWorldModifiers(entry['Right Effect']),
                    { next: right },
                ],
            ],
            entry.Weight,
            entry['Require']
                .map((q) => parseWorldQuery(q))
                .filter((q): q is WorldQuery => q !== undefined),
        )
    })
    return cards
}

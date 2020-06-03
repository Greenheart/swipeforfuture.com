import { cards as defaultCards } from '../data/default/cards'
import { events as defaultEvents } from '../data/default/events'
import { eventCards as defaultEventCards } from '../data/default/event-cards'

import {
    WorldState,
    StatDefinition,
    CardData,
    EventCards,
    WorldEvent,
    GameWorld,
} from './ContentTypes'

export const DEFAULT_GAME_STATE: WorldState = Object.freeze({
    state: {
        environment: 40,
        people: 60,
        security: 75,
        money: 90,
    },
    flags: {},
})

const defaultStats: StatDefinition[] = [
    {
        id: 'environment',
        name: 'Environment',
        icon: 'GiWheat',
    },
    {
        id: 'people',
        name: 'People',
        icon: 'IoIosPeople',
    },
    {
        id: 'security',
        name: 'Security',
        icon: 'GiAk47',
    },
    {
        id: 'money',
        name: 'Money',
        icon: 'GiMoneyStack',
    },
]

export const defaultGameWorld: GameWorld = {
    stats: defaultStats,
    cards: defaultCards,
    events: defaultEvents,
    eventCards: defaultEventCards,
    defaultState: DEFAULT_GAME_STATE,
}

const internalGameWorlds: {
    [worldId: string]: GameWorld
} = {
    default: defaultGameWorld,
}

async function tryLoadFromLocalStorage(
    path: string,
): Promise<GameWorld | null> {
    const matchLocal = path.match(/^local:\/\/(.*)/)

    if (matchLocal) {
        // Import from SFF game world editor hosted on the same domain.
        // Using localStorage to share data across apps
        const id = matchLocal[1]
        const gameWorldId = 'game_world:' + id
        let gameWorld = {}
        try {
            const serializedData = localStorage.getItem(gameWorldId)
            const data = serializedData ? JSON.parse(serializedData) : null
            if (!data)
                throw new Error(
                    'Could not load data from local storage: ' + gameWorldId,
                )
            gameWorld = data || {}
        } catch (e) {
            console.log(e)
        }
        return Object.assign({}, defaultGameWorld, gameWorld)
    }

    return null
}

// Load GameWorld from data directory of this repository
async function tryLoadFromInternalData(
    path: string,
): Promise<GameWorld | null> {
    const matchInternal = path.match(/^internal:\/\/(.*)/)

    if (matchInternal) {
        const id = matchInternal[1]
        const gameWorld = internalGameWorlds[id]
        if (!gameWorld) {
            console.warn('Could not load local game world: ', id)
            return defaultGameWorld
        }
        return gameWorld
    }

    return null
}

async function tryLoadFromRestAPI(path: string): Promise<GameWorld | null> {
    // Default: expect a folder to represent a game world and contain specific JSON-files.
    const statsPath = path + '/stats.json'
    const cardsPath = path + '/cards.json'
    const eventsPath = path + '/events.json'
    const eventCardsPath = path + '/event-cards.json'
    const defaultStatePath = path + '/default-state.json'

    const [stats, cards, events, eventCards, defaultState] = await Promise.all<
        StatDefinition[],
        CardData[],
        WorldEvent[],
        EventCards,
        WorldState
    >([
        fetchJSON(statsPath, defaultStats),
        fetchJSON(cardsPath, []),
        fetchJSON(eventsPath, []),
        fetchJSON(eventCardsPath, {}),
        fetchJSON(defaultStatePath, DEFAULT_GAME_STATE),
    ])

    return {
        stats,
        cards,
        events,
        eventCards,
        defaultState,
    }
}

export async function loadGameWorld(path: string) {
    return (
        (await tryLoadFromInternalData(path)) ||
        (await tryLoadFromLocalStorage(path)) ||
        (await tryLoadFromRestAPI(path))
    )
}

async function fetchJSON<T>(path: string, defaultValue: T): Promise<T> {
    try {
        console.log('fetching path: ', path)
        return await (await window.fetch(path)).json()
    } catch (e) {
        console.warn('Could not load path: ' + path)

        return defaultValue
    }
}

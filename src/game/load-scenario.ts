import {
    WorldState,
    StatDefinition,
    CardData,
    EventCards,
    WorldEvent,
    GameWorld,
    WorldStateModifier,
} from './ContentTypes'

async function tryLoadFromLocalStorage(
    path: string,
): Promise<GameWorld | null> {
    const matchLocal = path.match(/^local:\/\/(.*)/)

    if (matchLocal) {
        // Import from SFF game world editor hosted on the same domain.
        // Using localStorage to share data across apps
        const id = matchLocal[1]
        const gameWorldId = 'game_world:' + id
        const gameWorld: GameWorld = {
            stats: [],
            cards: [],
            events: [],
            eventCards: {},
            defaultState: {
                state: {},
                flags: {},
            },
            worldStateModifiers: []
        }
        const serializedData = localStorage.getItem(gameWorldId)
        const data: GameWorld = serializedData
            ? JSON.parse(serializedData)
            : null
        if (!data)
            throw new Error(
                'Could not load data from local storage: ' + gameWorldId,
            )
        return Object.assign(gameWorld, data)
    }

    return null
}

async function tryLoadFromRestAPI(path: string): Promise<GameWorld | null> {
    // Default: expect a folder to represent a GameWorld and contain specific JSON-files.
    const statsPath = path + '/stats.json'
    const cardsPath = path + '/cards.json'
    const eventsPath = path + '/events.json'
    const eventCardsPath = path + '/event-cards.json'
    const defaultStatePath = path + '/default-state.json'
    const worldStateModifiersPath = path + '/modifiers.json'

    const [stats, cards, events, eventCards, defaultState, worldStateModifiers] = await Promise.all<
        StatDefinition[],
        CardData[],
        WorldEvent[],
        EventCards,
        WorldState,
        WorldStateModifier[]
    >([
        fetchJSON(statsPath),
        fetchJSON(cardsPath),
        fetchJSON(eventsPath),
        fetchJSON(eventCardsPath),
        fetchJSON(defaultStatePath),
        fetchJSON(worldStateModifiersPath),
    ])

    return {
        stats,
        cards,
        events,
        eventCards,
        defaultState,
        worldStateModifiers,
    }
}

export async function loadScenario(path: string) {
    return (
        (await tryLoadFromLocalStorage(path)) ||
        (await tryLoadFromRestAPI(path))
    )
}

async function fetchJSON<T>(path: string): Promise<T> {
    console.log('fetching path: ', path)
    return await (await window.fetch(path)).json()
}

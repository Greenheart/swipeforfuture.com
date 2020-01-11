import defaultCards from '../data/default/cards.js'
import defaultEvents from '../data/default/events.js'
import defaultEventCards from '../data/default/event-cards.js'

for (const eventCardId of Object.keys(defaultEventCards)) {
    defaultEventCards[eventCardId].type = 'event'
}

export const DEFAULT_GAME_STATE = Object.freeze({
    state: {
        environment: 40,
        people: 60,
        security: 75,
        money: 90,
    },
    flags: {},
})

export const defaultGameWorld = {
    cards: defaultCards,
    events: defaultEvents,
    eventCards: defaultEventCards,
    defaultState: DEFAULT_GAME_STATE,
}

const internalGameWorlds = {
    default: defaultGameWorld,
}

export async function loadGameWorld(path) {
    // Load JS representation of worlds for easy development
    const matchInternal = path.match(/^internal:\/\/(.*)/)
    if (matchInternal) {
        const id = matchInternal[1]
        const gameWorld = internalGameWorlds[id]
        if (!gameWorld) {
            console.warn('Could not load local game world: ', id)
            return defaultGameWorld
        }
        return gameWorld
    } else {
        // Default: expect a folder to represent a game world and contain specific JSON-files.
        const cardsPath = path + '/cards.json'
        const eventsPath = path + '/events.json'
        const eventCardsPath = path + '/event-cards.json'
        const defaultStatePath = path + '/default-state.json'

        // IDEA: load data in parallel instead of sequentially too improve performance
        const cards = await fetchJSON(cardsPath, [])
        const events = await fetchJSON(eventsPath, [])
        const eventCards = await fetchJSON(eventCardsPath, {})
        const defaultState = await fetchJSON(
            defaultStatePath,
            DEFAULT_GAME_STATE,
        )

        return {
            cards,
            events,
            eventCards,
            defaultState,
        }
    }
}

async function fetchJSON(path, defaultValue) {
    try {
        console.log('fetching path: ', path)
        return await (await window.fetch(path)).json()
    } catch (e) {
        console.warn('Could not load path: ' + path)

        return defaultValue
    }
}

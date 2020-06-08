import { GameState } from './GameTypes'
import {
    GameWorld,
    WorldState,
    WorldQuery,
    GameWorldModifier,
    WorldEvent,
    CardData,
    EventCard,
    CardActionData,
    EventCardActionData,
    EventCardId,
} from './ContentTypes'

// TODO: break out dev tools and global state from this module, so the Game component itself handles that based on state
// The new functional approach with this module will allow us to get deeper insights into how the game runs.
// This hopefully should make it easier to separate dev tools from the GameScenario module.

// declare global {
//     interface Window {
//         DEV_TOOLS_ACTIVE: Boolean
//         DEV_TOOLS: {
//             availableCards?: CardData[]
//             availableEvents?: WorldEvent[]
//             nextCard?: CardData | EventCard
//             game?: GameState
//         }
//     }
// }

// // Enable DEV_TOOLS for local development by default to improve DX
// window.DEV_TOOLS_ACTIVE = window.location.hostname.includes('localhost')
// window.DEV_TOOLS = {}

// IDEA: Use Scenario type instead of GameWorld, to add full context with the Scenario ID too.
// Could make debugging easier since the scenario could know it's ID.
// Porentially, this could also allow us to remove the GameWorld Type and replace it with Scenario, which is much easier to understand.

// IDEA: Refactor into a set of pure functions that take can simulate a scenario deterministically. Maybe not use a class, but rather a set of functions
// IDEA: Replace Math.random() usage and require all user code to pass in the random selection function, to ensure this module is deterministic.
// IDEA: By keeping the GameScenario stateless, it will be easy to use both in game and in tests.
// IDEA: Stateless It could also allow other uses, like training an AI to find the optimal endgame conditions, and the strategies used to get there.

// IDEA: Ensure functions are pure by making copies of objects instead of passing by reference.
//       This is especially important when using the default data `scenario` which shouldn't be mutated.

/**
 * Get the initial state for a given scenario.
 *
 * @param scenario The scenario default data which holds all cards, events and similar
 */
export function getInitialState(scenario: GameWorld): GameState {
    return {
        world: scenario.defaultState,
        card: getInitialCard(scenario),
        rounds: 0,
    }
}

/**
 * Get the updated state for a scenario based on previous state and the action taken to move forward.
 *
 * Since all dependencies are clearly stated throughout all child functions,
 * it's really easy to change partial data and state to get a different updated state.
 * This could be really useful for testing, or perhaps even some kind of AI to find the optimal actions/strategy
 *
 * @param scenario The scenario default data which holds all cards, events and similar
 * @param prevState The state before this update
 * @param card The currently visible card that the player is acting upon
 * @param action The player's choosen action for how to move forward in the game
 */
export function getUpdatedState(
    scenario: GameWorld,
    prevState: GameState,
    card: CardData | EventCard,
    action: CardActionData | EventCardActionData,
): GameState {
    const updatedWorld = getUpdatedWorld(
        scenario,
        action.modifier,
        prevState.world,
    )

    return {
        world: updatedWorld,
        card: getNextCard(scenario, updatedWorld, card, action),
        rounds: prevState.rounds + 1,
    }
}

function getUpdatedWorld(
    scenario: GameWorld,
    { type = 'add', state = {}, flags = {} }: GameWorldModifier,
    world: WorldState,
): WorldState {
    // get default values for missing props by destructuring the incoming `modifier` and then directly reassembling it
    // IDEA: Could this all be done in the function declaration, when specifying parameters?
    const modifier: GameWorldModifier = { type, state, flags }
    const updatedWorldState = updateWorldState(scenario, modifier, world)
    const updatedWorldFlags = updateWorldFlags(scenario, modifier, world)

    return {
        state: updatedWorldState,
        flags: updatedWorldFlags,
    }
}

function updateWorldState(
    scenario: GameWorld,
    modifier: GameWorldModifier,
    world: WorldState,
): WorldState['state'] {
    const currentWorldState: WorldState['state'] =
        modifier.type === 'replace'
            ? Object.assign({}, scenario.defaultState.state)
            : Object.assign({}, world.state)

    const stateModifier = modifier.state || {}
    const updatedWorldState = Object.entries(stateModifier).reduce<
        WorldState['state']
    >((updatedState: WorldState['state'], [key, value]) => {
        const newValue =
            modifier.type === 'set' || modifier.type === 'replace'
                ? value
                : value + (updatedState[key] || 0)

        updatedState[key] = Math.min(Math.max(newValue, 0), 100)

        return updatedState
    }, currentWorldState)

    return updatedWorldState
}

function updateWorldFlags(
    scenario: GameWorld,
    modifier: GameWorldModifier,
    world: WorldState,
): WorldState['flags'] {
    const currentWorldFlags: WorldState['flags'] =
        modifier.type === 'replace'
            ? Object.assign({}, scenario.defaultState.flags)
            : Object.assign({}, world.flags)

    const flagsModifier = modifier.flags || {}
    const updatedWorldFlags = Object.entries(flagsModifier).reduce<
        WorldState['flags']
    >((updatedFlags, [key, value]) => {
        updatedFlags[key] = value
        return updatedFlags
    }, currentWorldFlags)

    return updatedWorldFlags
}

function getInitialCard(scenario: GameWorld): EventCard | CardData {
    const availableEvents = getAvailableEvents(scenario, scenario.defaultState)
    const event = selectNextEvent(availableEvents)

    if (event) {
        return selectEventCard(scenario, event.initialEventCardId)
    } else {
        return selectNextCard(
            getAvailableCards(scenario, scenario.defaultState),
        )
    }
}

function getNextCard(
    scenario: GameWorld,
    updatedWorld: WorldState,
    card: CardData | EventCard,
    action: CardActionData | EventCardActionData,
): CardData | EventCard {
    const { eventCards } = scenario
    const availableEvents = getAvailableEvents(scenario, updatedWorld)
    let availableCards: CardData[] = []

    const nextEventCardId: string | null =
        card.type === 'event' && 'nextEventCardId' in action
            ? action.nextEventCardId
            : null
    const eventStartingNow = !nextEventCardId
        ? selectNextEvent(availableEvents)
        : null
    let nextCard

    // Only select the next EventCard if a specific one is given
    // Else cancel the event and continue with normal cards.
    if (nextEventCardId) {
        if (!eventCards.hasOwnProperty(nextEventCardId)) {
            throw new Error(
                `eventCardId "${nextEventCardId}" does not exist. Make sure it's spelled correctly`,
            )
        }
        nextCard = selectEventCard(scenario, nextEventCardId)
    } else if (eventStartingNow) {
        nextCard = selectEventCard(
            scenario,
            eventStartingNow.initialEventCardId,
        )
    } else {
        availableCards = getAvailableCards(scenario, updatedWorld)
        nextCard = selectNextCard(availableCards)
    }

    // TODO: break out dev tools from this module and add it to the Game Component instead. See comments up top for details.
    // if (window.DEV_TOOLS_ACTIVE) {
    //     window.DEV_TOOLS.game = {
    //         world: this.state.world,
    //         rounds: this.state.rounds,
    //         card: this.state.card,
    //     }

    //     window.DEV_TOOLS.availableCards = availableCards
    //     window.DEV_TOOLS.availableEvents = availableEvents

    //     console.log('DEV TOOLS: ', window.DEV_TOOLS)
    // }

    if (!nextCard) throw new Error('Content error. No next card available.')
    return nextCard
}

function getAvailableEvents(
    scenario: GameWorld,
    world: WorldState,
): WorldEvent[] {
    const { events } = scenario
    return events.filter((e) => hasMatchingWorldQuery(world, e.isAvailableWhen))
}

function getAvailableCards(scenario: GameWorld, world: WorldState): CardData[] {
    const { cards } = scenario
    return cards.filter((c) => hasMatchingWorldQuery(world, c.isAvailableWhen))
}

function hasMatchingWorldQuery(
    world: WorldState,
    worldQueries: WorldQuery[],
): Boolean {
    return worldQueries.some((q) => isMatchingWorldQuery(world, q))
}

function isMatchingWorldQuery(
    world: WorldState,
    { state = {}, flags = {} }: WorldQuery,
): Boolean {
    const hasStateMatch = Object.entries(state).every(
        ([key, [min, max]]) =>
            world.state[key] >= min && world.state[key] <= max,
    )

    const result =
        hasStateMatch &&
        Object.entries(flags).every(
            ([flag, value]) => world.flags[flag] === value,
        )

    return result
}

function selectNextEvent(events: WorldEvent[] = []): WorldEvent | undefined {
    const event = selectRandomFrom(events)
    if (event && Math.random() <= event.probability) {
        return event
    }
}

function selectEventCard(scenario: GameWorld, cardId: EventCardId): EventCard {
    const eventCard = scenario.eventCards[cardId]
    if (!eventCard)
        throw new Error(
            `ContentError: EventCard with EventCardId "${cardId}" does not exist`,
        )
    return eventCard
}

function selectRandomFrom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

function selectNextCard(cards: CardData[] = []): CardData {
    return selectWeightedRandomFrom(cards)
}

function selectWeightedRandomFrom<T extends { weight: number }>(
    array: T[],
    weightFunc = (element: T) => element.weight,
): T {
    const { selectionList, count } = array.reduce<{
        count: number
        selectionList: number[]
    }>(
        (acc, element) => {
            acc.count += weightFunc(element)
            acc.selectionList.push(acc.count)
            return acc
        },
        { count: 0, selectionList: [] },
    )

    const selectionPosition = Math.random() * count
    const selectionIndex = selectionList.findIndex((max, index, array) => {
        const min = index > 0 ? array[index - 1] : 0
        return selectionPosition >= min && selectionPosition <= max
    })

    return array[selectionIndex]
}

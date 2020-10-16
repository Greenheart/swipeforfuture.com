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
import {
    WorldStateExtension,
    worldStateExtensionFromData,
} from './WorldStateExtensions'

export interface GameScenario {
    getInitialState(): GameState
    getUpdatedState(
        prevState: GameState,
        card: CardData | EventCard,
        action: CardActionData | EventCardActionData,
    ): GameState
    stats: GameWorld['stats']
}

export type GameScenarioOptions = {
    random: () => number
    worldStateExtensions: WorldStateExtension[]
}

/**
 * BasicGameScenario used to simulate game scenarios.
 *
 * The design goal is to keep this stateless, allowing user code to manage state.
 */
export class BasicGameScenario implements GameScenario {
    protected _scenario: Omit<GameWorld, "worldStateModifiers">
    protected _random: () => number
    protected _worldStateExtensions: WorldStateExtension[]

    constructor(
        scenario: Omit<GameWorld, "worldStateModifiers">,
        options: Partial<GameScenarioOptions> = {},
    ) {
        const {
            random = Math.random,
            worldStateExtensions = []
        } = options;
        this._scenario = scenario
        this._random = random
        this._worldStateExtensions = worldStateExtensions
    }

    get stats() {
        return this._scenario.stats
    }

    /**
     * Get the initial state for a given scenario.
     *
     * @param scenario The scenario default data which holds all cards, events and similar
     */
    getInitialState(): GameState {
        return {
            world: this._scenario.defaultState,
            card: this.getInitialCard(),
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
    getUpdatedState(
        prevState: GameState,
        card: CardData | EventCard,
        action: CardActionData | EventCardActionData,
    ): GameState {
        const updatedWorld = this.getUpdatedWorld(
            action.modifier,
            prevState.world,
        )

        return {
            world: updatedWorld,
            card: this.getNextCard(updatedWorld, card, action),
            rounds: prevState.rounds + 1,
        }
    }

    getUpdatedWorld(
        inputModifier: GameWorldModifier,
        world: WorldState,
    ): WorldState {
        const modifier: GameWorldModifier = {
            type: 'add',
            state: {},
            flags: {},
            ...inputModifier,
        }
        const updatedWorldState = this.updateWorldState(modifier, world)
        const updatedWorldFlags = this.updateWorldFlags(modifier, world)
        const newWorld = this.applyWorldStateExtensions(
            this._worldStateExtensions,
            {
                state: updatedWorldState,
                flags: updatedWorldFlags,
            },
        )

        return newWorld
    }

    updateWorldState(
        modifier: GameWorldModifier,
        world: WorldState,
    ): WorldState['state'] {
        const currentWorldState: WorldState['state'] =
            modifier.type === 'replace'
                ? Object.assign({}, this._scenario.defaultState.state)
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

    updateWorldFlags(
        modifier: GameWorldModifier,
        world: WorldState,
    ): WorldState['flags'] {
        const currentWorldFlags: WorldState['flags'] =
            modifier.type === 'replace'
                ? Object.assign({}, this._scenario.defaultState.flags)
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

    applyWorldStateExtensions(
        extensions: WorldStateExtension[],
        world: WorldState,
    ): WorldState {
        return extensions.reduce((acc, extension) => extension(acc), world)
    }

    getInitialCard(): EventCard | CardData {
        const availableEvents = this.getAvailableEvents(
            this._scenario.defaultState,
        )
        const event = this.selectNextEvent(availableEvents)

        if (event) {
            return this.selectEventCard(event.initialEventCardId)
        } else {
            return this.selectNextCard(
                this.getAvailableCards(this._scenario.defaultState),
            )
        }
    }

    getNextCard(
        updatedWorld: WorldState,
        card: CardData | EventCard,
        action: CardActionData | EventCardActionData,
    ): CardData | EventCard {
        const { eventCards } = this._scenario
        const availableEvents = this.getAvailableEvents(updatedWorld)
        let availableCards: CardData[] = []

        const nextEventCardId: string | null =
            card.type === 'event' && 'nextEventCardId' in action
                ? action.nextEventCardId
                : null
        const eventStartingNow = !nextEventCardId
            ? this.selectNextEvent(availableEvents)
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
            nextCard = this.selectEventCard(nextEventCardId)
        } else if (eventStartingNow) {
            nextCard = this.selectEventCard(eventStartingNow.initialEventCardId)
        } else {
            availableCards = this.getAvailableCards(updatedWorld)
            nextCard = this.selectNextCard(availableCards)
        }

        if (!nextCard) throw new Error('Content error. No next card available.')
        return nextCard
    }

    getAvailableEvents(world: WorldState): WorldEvent[] {
        const { events } = this._scenario
        return events.filter((e) =>
            this.hasMatchingWorldQuery(world, e.isAvailableWhen),
        )
    }

    getAvailableCards(world: WorldState): CardData[] {
        const { cards } = this._scenario
        return cards.filter((c) =>
            this.hasMatchingWorldQuery(world, c.isAvailableWhen),
        )
    }

    hasMatchingWorldQuery(
        world: WorldState,
        worldQueries: WorldQuery[],
    ): Boolean {
        return worldQueries.some((q) => this.isMatchingWorldQuery(world, q))
    }

    isMatchingWorldQuery(
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

    selectNextEvent(events: WorldEvent[] = []): WorldEvent | undefined {
        const event = this.selectRandomFrom(events)
        if (event && this._random() <= event.probability) {
            return event
        }
    }

    selectEventCard(cardId: EventCardId): EventCard {
        const eventCard = this._scenario.eventCards[cardId]
        if (!eventCard)
            throw new Error(
                `ContentError: EventCard with EventCardId "${cardId}" does not exist`,
            )
        return eventCard
    }

    selectRandomFrom<T>(array: T[]): T {
        return array[Math.floor(this._random() * array.length)]
    }

    selectNextCard(cards: CardData[] = []): CardData {
        return this.selectWeightedRandomFrom(cards)
    }

    selectWeightedRandomFrom<T extends { weight: number }>(
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

        const selectionPosition = this._random() * count
        const selectionIndex = selectionList.findIndex((max, index, array) => {
            const min = index > 0 ? array[index - 1] : 0
            return selectionPosition >= min && selectionPosition <= max
        })

        return array[selectionIndex]
    }

    /**
     * Create a runtime GameScenario from data
     * 
     * @param data Data needed to setup a basic game scenario
     */
    public static fromData(data: GameWorld): GameScenario {
        const extensions = worldStateExtensionFromData(data.worldStateModifiers)
        return new BasicGameScenario(data, {worldStateExtensions: extensions});
    }
}

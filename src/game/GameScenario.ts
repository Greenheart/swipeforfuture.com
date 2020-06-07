import { SwipeDirection } from '../util/constants'

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
} from '../game/ContentTypes'

type GameState = {
    world: WorldState
    card: CardData | EventCard
    rounds: number
}

interface IGameScenario {
    // IDEA: Use Scenario type instead of GameWorld, to add full context with the Scenario ID too.
    // Could make debugging easier since the scenario could know it's ID.
    // Porentially, this could also allow us to remove the GameWorld Type and replace it with Scenario, which is much easier to understand.
    scenario: GameWorld
    state: GameState
}

declare global {
    interface Window {
        DEV_TOOLS_ACTIVE: Boolean
        DEV_TOOLS: {
            availableCards?: CardData[]
            availableEvents?: WorldEvent[]
            nextCard?: CardData | EventCard
            game?: GameState
        }
    }
}

// Enable DEV_TOOLS for local development by default to improve DX
window.DEV_TOOLS_ACTIVE = window.location.hostname.includes('localhost')
window.DEV_TOOLS = {}

export default class GameScenario implements IGameScenario {
    scenario: GameWorld
    state: GameState

    constructor(worldData: GameWorld) {
        this.scenario = worldData
        this.state = this.getInitialState()
    }

    render() {
        const card = this.addUniqueCardId(this.state.card)
        const worldState = this.state.world.state
        const stats = this.scenario.stats.map((stat) =>
            Object.assign({}, stat, {
                value: worldState[stat.id],
            }),
        )
        return (
            <>
                <Stats stats={stats} />
                <Deck
                    onSwipe={this.onSwipe.bind(this)}
                    card={card}
                    tick={this.state.rounds}
                />
                <Footer>
                    <div className="time-remaining"></div>
                </Footer>
            </>
        )
    }

    getInitialState(): GameState {
        const defaultState = this.scenario.defaultState
        return {
            world: defaultState,
            card: this.getInitialCard(defaultState),
            rounds: 0,
        }
    }

    getInitialCard(world: WorldState): EventCard | CardData {
        const availableEvents = this.getAvailableEvents(world)
        const event = this.selectNextEvent(availableEvents)

        if (event) {
            return this.selectEventCard(event.initialEventCardId)
        } else {
            return this.selectNextCard(
                this.getAvailableCards(this.scenario.defaultState),
            )
        }
    }

    getAvailableCards(world: WorldState): CardData[] {
        const { cards } = this.scenario
        return cards.filter((c) =>
            this.hasMatchingWorldQuery(world, c.isAvailableWhen),
        )
    }

    getAvailableEvents(world: WorldState): WorldEvent[] {
        const { events } = this.scenario
        return events.filter((e) =>
            this.hasMatchingWorldQuery(world, e.isAvailableWhen),
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

    onSwipe(card: CardData | EventCard, direction: SwipeDirection): void {
        const currentAction =
            direction === SwipeDirection.Left
                ? card.actions.left
                : card.actions.right

        const updatedWorld = this.getUpdatedWorld(currentAction.modifier)

        this.state.world = updatedWorld
        this.state.card = this.getNextCard(updatedWorld, card, currentAction)
        this.state.rounds = this.state.rounds + 1
    }

    getNextCard(
        updatedWorld: WorldState,
        card: CardData | EventCard,
        currentAction: CardActionData | EventCardActionData,
    ): CardData | EventCard {
        const { eventCards } = this.scenario
        const availableEvents = this.getAvailableEvents(updatedWorld)
        let availableCards: CardData[] = []

        const nextEventCardId: string | null =
            card.type === 'event' && 'nextEventCardId' in currentAction
                ? currentAction.nextEventCardId
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

        if (window.DEV_TOOLS_ACTIVE) {
            window.DEV_TOOLS.game = {
                world: this.state.world,
                rounds: this.state.rounds,
                card: this.state.card,
            }

            window.DEV_TOOLS.availableCards = availableCards
            window.DEV_TOOLS.availableEvents = availableEvents

            console.log('DEV TOOLS: ', window.DEV_TOOLS)
        }

        if (!nextCard) throw new Error('Content error. No next card available.')
        return nextCard
    }

    getUpdatedWorld({
        type = 'add',
        state = {},
        flags = {},
    }: GameWorldModifier): WorldState {
        // get default values for missing props by destructuring the incoming `modifier` and then directly reassembling it
        // IDEA: Could this all be done in the function declaration, when specifying parameters?
        const modifier: GameWorldModifier = { type, state, flags }
        const updatedWorldState = this.updateWorldState(modifier)
        const updatedWorldFlags = this.updateWorldFlags(modifier)

        return {
            state: updatedWorldState,
            flags: updatedWorldFlags,
        }
    }

    updateWorldState(modifier: GameWorldModifier): WorldState['state'] {
        const currentWorldState: WorldState['state'] =
            modifier.type === 'replace'
                ? Object.assign({}, this.scenario.defaultState.state)
                : Object.assign({}, this.state.world.state)

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

    updateWorldFlags(modifier: GameWorldModifier): WorldState['flags'] {
        const currentWorldFlags: WorldState['flags'] =
            modifier.type === 'replace'
                ? Object.assign({}, this.scenario.defaultState.flags)
                : Object.assign({}, this.state.world.flags)

        const flagsModifier = modifier.flags || {}
        const updatedWorldFlags = Object.entries(flagsModifier).reduce<
            WorldState['flags']
        >((updatedFlags, [key, value]) => {
            updatedFlags[key] = value
            return updatedFlags
        }, currentWorldFlags)

        return updatedWorldFlags
    }

    addUniqueCardId(
        card: CardData | EventCard,
        index: number = 0,
    ): (CardData | EventCard) & { id: string } {
        return {
            ...card,
            id: Date.now() + ':' + index,
        }
    }

    selectNextCard(cards: CardData[] = []): CardData {
        return this.selectWeightedRandomFrom(cards)
    }

    selectNextEvent(events: WorldEvent[] = []): WorldEvent | undefined {
        const event = this.selectRandomFrom(events)
        if (event && Math.random() <= event.probability) {
            return event
        }
    }

    selectRandomFrom<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)]
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

        const selectionPosition = Math.random() * count
        const selectionIndex = selectionList.findIndex((max, index, array) => {
            const min = index > 0 ? array[index - 1] : 0
            return selectionPosition >= min && selectionPosition <= max
        })

        return array[selectionIndex]
    }

    selectEventCard(cardId: EventCardId): EventCard {
        const { eventCards } = this.scenario
        const eventCard = eventCards[cardId]
        if (!eventCard)
            throw new Error(
                `ContentError: EventCard with EventCardId "${cardId}" does not exist`,
            )
        return eventCard
    }
}

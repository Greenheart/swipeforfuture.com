// ContentTypes are used to describe the format and structure for game scenarios and content.

export type GameWorld = {
    stats: StatDefinition[]
    cards: CardData[]
    events: WorldEvent[]
    eventCards: EventCards
    defaultState: WorldState
    worldStateModifiers: WorldStateModifier[]
}

export type WorldStateModifier = {
    type: "round"
} | {
    type: "cycle"
    id: string
    length: number
} | {
    type: "sum" | "min" | "max",
    sourceIds: string[],
    targetId: string,
} | {
    type: "debug"
    stateIds?: string[]
    flagIds?: string[]
}

export type WorldState = {
    state: {
        [stateProperty: string]: number
    }
    flags: {
        [flagProperty: string]: boolean
    }
}

export type StatDefinition = {
    id: string
    name: string
    icon: string
    iconSize?: string
}

export interface CardDescription {
    image: string
    title: string
    text: string
    location: string
    weight: number
}

export type GameWorldModifier = Partial<WorldState> & {
    type?: 'add' | 'set' | 'replace'
}

export interface CardActionData {
    description?: string
    modifier: GameWorldModifier
}

export interface CardData extends CardDescription {
    type: 'card'
    isAvailableWhen: WorldQuery[]
    actions: {
        left: CardActionData
        right: CardActionData
    }
}

export type WorldStateRange = [number, number]

export interface WorldQuery {
    state?: {
        [x: string]: WorldStateRange
    }
    flags?: {
        [x: string]: boolean
    }
}

/**
 * WorldEvents start with a specific card and then offer full control to show EventCards in any order you like.
 * This makes WorldEvents great for story where you as a scenario creator want more control.
 *
 * @param initialEventCardId Used to find the EventCard to start the event with
 * @param isAvailableWhen An array of WorldQueries. If any of them match, the event is available for selection.
 * @param probability When any WorldQuery match and makes this event available, this probability defines how likely this event will trigger.
 */
export interface WorldEvent {
    initialEventCardId: EventCardId
    isAvailableWhen: WorldQuery[]
    probability: number
}

export type EventCards = {
    [eventCardId: string]: EventCard
}

export interface EventCard extends CardDescription {
    type: 'event'
    actions: {
        left: EventCardActionData
        right: EventCardActionData
    }
}

export type EventCardId = string

export interface EventCardActionData extends CardActionData {
    nextEventCardId: EventCardId | null
}

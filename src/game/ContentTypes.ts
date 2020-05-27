export type GameWorld = {
    stats: StatDefinition[]
    cards: CardData[]
    events: WorldEvent[]
    eventCards: EventCards
    defaultState: WorldState
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

export interface WorldEvent {
    probability: number
    isAvailableWhen: WorldQuery[]
    initialEventCardId: EventCardId
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

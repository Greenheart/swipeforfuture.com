type WorldState = {}

interface CardDescription {
    image: string
    title: string
    text: string
    weight: number
}

// TODO: decide if these potential changes are wanted or not.

interface GameWorldModifier {
    modifierType?: 'add' | 'set' | 'replace'
    state?: {
        environment?: number
        people?: number
        security?: number
        money?: number
    }
    flags?: {
        [x: string]: boolean
    }
}

interface CardActionData {
    description?: string
    modifier: GameWorldModifier
}

interface CardData extends CardDescription {
    isAvailableWhen: WorldQuery[]
    actions: {
        left: CardActionData
        right: CardActionData
    }
}

type WorldStateRange = [number, number]

interface WorldQuery {
    state?: {
        environment?: WorldStateRange
        people?: WorldStateRange
        security?: WorldStateRange
        money?: WorldStateRange
        [x: string]: WorldStateRange
    }
    flags?: {
        [x: string]: boolean
    }
}

// -----------------------------

interface WorldEvent {
    probability: number
    shouldTriggerWhen?: WorldQuery[]
    initialEventCardId: EventCardId
}

type EventCards = {
    [eventCardId: string]: EventCard
}

interface EventCard extends CardDescription {
    actions: {
        left: EventCardActionData
        right: EventCardActionData
    }
}

type EventCardId = string

interface EventCardActionData extends CardActionData {
    nextEventCardId: EventCardId
}

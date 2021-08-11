// ContentTypes are used to describe the format and structure for game scenarios and content.

export type GameWorld = {
    stats: StatDefinition[]
    cards: Card[]
    defaultState: WorldState
    worldStateModifiers: WorldStateModifier[]
}

export type WorldStateModifier =
    | {
          type: 'round'
      }
    | {
          type: 'cycle'
          id: string
          length: number
      }
    | {
          type: 'sum' | 'min' | 'max'
          sourceIds: string[]
          targetId: string
      }
    | {
          type: 'debug'
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

export enum CardPriority {
    Event = 0,
    Card = 1
}

export interface CardActionData {
    description?: string
    modifiers: GameWorldModifier[]
    next?: Card['id']
    priority?: CardPriority
}

export interface Card extends CardDescription {
    id: string
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

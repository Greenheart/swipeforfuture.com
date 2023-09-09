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
      }

export type WorldState = {
    state: {
        [stateProperty: string]: number
    }
}

export type StatDefinition = {
    id: string
    name: string
    min: number
    max: number
    icon: { src: string; size?: string }
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
    Card = 1,
}

export interface CardActionData {
    description?: string
    modifiers: GameWorldModifier[]
    next?: Card['id']
}

export interface Card extends CardDescription {
    id: string
    isAvailableWhen: WorldQuery[]
    actions: {
        left: CardActionData
        right: CardActionData
    }
    priority: CardPriority
}

/**
 * [number, number] = matches any value in the given range
 * number           = matches when the value is exactly equal, useful to simulate booleans or specific state.
 */
export type WorldStateRange = [number, number] | number

/**
 * IDEA: Maybe refactor this to only keep a single level of the object, like { [x: string]: WorldStateRange }
 * This could save additional scenario output data size, as well as simplifying the codebase further
 */
export interface WorldQuery {
    state?: {
        [x: string]: WorldStateRange
    }
}

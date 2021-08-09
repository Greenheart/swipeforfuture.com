import type { WorldState, CardData, EventCard } from './ContentTypes'

// GameTypes are used for the game implementation.

export type GameState = {
    world: WorldState
    card: CardData | EventCard
    rounds: number
}

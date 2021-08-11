import type { WorldState, Card } from './ContentTypes'

// GameTypes are used for the game implementation.

export type GameState = {
    world: WorldState
    card: Card
    rounds: number
}

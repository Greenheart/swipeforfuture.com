import type { WorldState, Card } from '$shared/ContentTypes'

// GameTypes are used for the game implementation.

export type GameState = {
    world: WorldState
    card: Card
    rounds: number
}

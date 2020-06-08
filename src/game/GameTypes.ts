import { WorldState, CardData, EventCard } from './ContentTypes'

// NOTE: This might be moved to GameScenario if it's only used there.
// The idea of separating Game types from Content types is to clarify what types will be useful for content development, and game development respectively.

export type GameState = {
    world: WorldState
    card: CardData | EventCard
    rounds: number
}

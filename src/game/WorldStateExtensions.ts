import { WorldState } from './ContentTypes'
import { WorldStateModifier } from "./ContentTypes"

export type WorldStateExtension = (worldState: WorldState) => WorldState

/**
 * World state extension counting the number of sounds from game start
 *
 * @param worldState The world state on which to operate
 * @returns WorldState The updated world state
 */
export const worldStateRounds: WorldStateExtension = (
    worldState: WorldState,
) => {
    return {
        state: {
            ...worldState.state,
            rounds: (worldState.state.rounds ?? 0) + 1,
        },
        flags: worldState.flags,
    }
}

/**
 * Create a cyclic world state extension with a given state id
 *
 * @param id The id to which cyclic state is assigned
 * @param length The length of the cycle
 * @returns WorldStateExtension A cyclic world state extension
 */
export function worldStateCycle(
    id: string,
    length: number,
): WorldStateExtension {
    return (worldState: WorldState) => {
        return {
            state: {
                ...worldState.state,
                [id]: ((worldState.state[id] ?? 0) + 1) % length,
            },
            flags: worldState.flags,
        }
    }
}

/**
 * Generate a list of world state extension from a data description
 * 
 * @param modifiers Data description of modifiers which can be converted to extensions
 */
export function worldStateExtensionFromData(modifiers: WorldStateModifier[]): WorldStateExtension[] {
    return modifiers.map(modifier => {
        switch (modifier.type) {
            case "round":
                return worldStateRounds
            case "cycle":
                return worldStateCycle(modifier.id, modifier.length)
            default: throw new Error("Missing modifier type: " + (modifier as any).type) // Hack to please the linter
        }
    })
}
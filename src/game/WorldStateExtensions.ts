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
 * Creates a reducer for world state parameters
 * 
 * @param targetId The id of the state parameter that will receive the result
 * @param sourceIds The ids of the sources that are used in the reduction
 * @param func The reducer function
 * @param initialValue The initial value to the reducer
 * @returns A world state extension that reduces a single value from multiple sources
 */
function reduceState(targetId: string, sourceIds: string[], func: (a: number, b: number) => number, initialValue?: number) {
    return (worldState: WorldState) => {
        const stateValues = sourceIds.map(id => worldState.state[id] ?? 0);
        const result = initialValue 
            ? stateValues.reduce((acc, value) => func(acc, value), initialValue)
            : stateValues.reduce((acc, value) => func(acc, value))
        return {
            state: {
                ...worldState.state,
                [targetId]: result,
            },
            flags: worldState.flags
        }
    }
}

/**
 * World state extension debug logging the world state
 *
 * @param worldState The world state on which to operate
 * @returns WorldState The input world state
 */
export const debugLogExtension: WorldStateExtension = (
    worldState: WorldState,
) => {
    console.table(worldState.state);
    console.table(worldState.flags)
    return worldState
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
            case "min":
                return reduceState(modifier.targetId, modifier.sourceIds, (a, b) => Math.min(a, b))
            case "max":
                return reduceState(modifier.targetId, modifier.sourceIds, (a, b) => Math.max(a, b))
            case "sum":
                return reduceState(modifier.targetId, modifier.sourceIds, (a, b) => a + b, 0)
            case "debug":
                return debugLogExtension
            default: throw new Error("Missing modifier type: " + (modifier as any).type) // Hack to please the linter
        }
    })
}
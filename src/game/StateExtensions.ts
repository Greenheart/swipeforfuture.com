import { GameState, StateModifier, Params } from './'
import { WorldStateModifier } from './ContentTypes'

export type StateExtension = StateModifier<Params>

/**
 * World state extension counting the number of sounds from game start
 *
 * @param worldState The world state on which to operate
 * @returns WorldState The updated world state
 */
export const useRounds: StateExtension = (state: GameState<Params>) => {
    return {
        ...state,
        params: {
            vars: {
                ...state.params.vars,
                rounds: (state.params.vars.rounds ?? 0) + 1,
            },
            flags: state.params.flags,
        },
    }
}

/**
 * Create a cyclic world state extension with a given state id
 *
 * @param id The id to which cyclic state is assigned
 * @param length The length of the cycle
 * @returns WorldStateExtension A cyclic world state extension
 */
export function createCycle(id: string, length: number): StateExtension {
    return (state: GameState<Params>) => {
        return {
            ...state,
            params: {
                vars: {
                    ...state.params.vars,
                    [id]: ((state.params.vars[id] ?? 0) + 1) % length,
                },
                flags: state.params.flags,
            },
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
export function createReducer(
    targetId: string,
    sourceIds: string[],
    func: (a: number, b: number) => number,
    initialValue?: number,
): StateExtension {
    return (state: GameState<Params>) => {
        const params = state.params
        const stateValues = sourceIds.map((id) => params.vars[id] ?? 0)
        const result = initialValue
            ? stateValues.reduce((acc, value) => func(acc, value), initialValue)
            : stateValues.reduce((acc, value) => func(acc, value))
        return {
            ...state,
            params: {
                flags: state.params.flags,
                vars: {
                    ...state.params.vars,
                    [targetId]: result,
                },
            },
        }
    }
}

/**
 * Creates a configured debug log extension that logs either the entire world state
 * or a number of specified state or flag parameters.
 *
 * @param worldState The world state on which to operate
 * @param stateIds Optional ids of the states to log
 * @param flagIds Optional ids of the flags to log
 * @returns A configured debug world state extension that logs state and flags to tables
 */
export function createDebugger(
    stateIds?: string[],
    flagIds?: string[],
): StateExtension {
    return (worldState: GameState<Params>) => {
        const params = worldState.params
        const outState =
            stateIds === undefined
                ? params.vars
                : stateIds.reduce<Params['vars']>((acc, id) => {
                      acc[id] = params.vars[id]
                      return acc
                  }, {})
        const outFlags =
            flagIds === undefined
                ? params.flags
                : flagIds.reduce<Params['flags']>((acc, id) => {
                      acc[id] = params.flags[id]
                      return acc
                  }, {})
        if (Object.keys(outState).length > 0) {
            console.table(outState)
        }
        if (Object.keys(outFlags).length > 0) {
            console.table(outFlags)
        }
        return worldState
    }
}

/**
 * Cap a number of identified parameters to be contained within a range
 *
 * @param ids Ids of the params which to limit to the range [min, max]
 * @param min The minimum number of the range
 * @param max The maximum number of the range
 */
export function createParameterCap(
    ids: string[],
    min: number,
    max: number,
): StateModifier<Params> {
    return (state) => ({
        ...state,
        params: {
            flags: state.params.flags,
            vars: {
                ...state.params.vars,
                ...ids.reduce<Params['vars']>((acc, id) => {
                    const value = state.params.vars[id]
                    if (value !== undefined) {
                        acc[id] = Math.max(min, Math.min(max, value))
                    }
                    return acc
                }, {}),
            },
        },
    })
}

/**
 * Generate a list of world state extension from a data description
 *
 * @param modifiers Data description of modifiers which can be converted to extensions
 */
export function stateExtensionsFromData(
    modifiers: WorldStateModifier[],
): StateExtension[] {
    return modifiers.map((modifier) => {
        switch (modifier.type) {
            case 'round':
                return useRounds
            case 'cycle':
                return createCycle(modifier.id, modifier.length)
            case 'min':
                return createReducer(
                    modifier.targetId,
                    modifier.sourceIds,
                    (a, b) => Math.min(a, b),
                )
            case 'max':
                return createReducer(
                    modifier.targetId,
                    modifier.sourceIds,
                    (a, b) => Math.max(a, b),
                )
            case 'sum':
                return createReducer(
                    modifier.targetId,
                    modifier.sourceIds,
                    (a, b) => a + b,
                    0,
                )
            case 'debug':
                return createDebugger(modifier.stateIds, modifier.flagIds)
            default:
                throw new Error(
                    'Missing modifier type: ' + (modifier as any).type,
                ) // Hack to please the linter
        }
    })
}

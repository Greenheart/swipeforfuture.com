import type { GameState, StateModifier, Params } from '.'
import type { GameWorld, WorldStateModifier } from '$shared/ContentTypes'

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
        },
    }
}

/**
 * Create a cyclic world state extension with a given state id
 *
 * @param id The id to which cyclic state is assigned
 * @param length The length of the cycle
 * @returns a state extesion that generates a cyclic param behaviour
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
 * or a number of specified state parameters.
 *
 * @param stateIds Optional ids of the states to log
 * @returns A configured debug world state extension that logs state to tables
 */
export function createDebugger(stateIds?: string[]): StateExtension {
    return (worldState: GameState<Params>) => {
        const params = worldState.params
        const outState =
            stateIds === undefined
                ? params.vars
                : stateIds.reduce<Params['vars']>((acc, id) => {
                      acc[id] = params.vars[id]
                      return acc
                  }, {})
        if (Object.keys(outState).length > 0) {
            console.table(outState)
        }
        return worldState
    }
}

/**
 * Cap a number of identified parameters to be contained within a range
 *
 * @param params The params which to limit to their the range [min, max]
 * @returns a state extension which caps params to the range [min, max]
 */
export function createParameterCap(
    params: GameWorld['stats'],
): StateModifier<Params> {
    return (state) => ({
        ...state,
        params: {
            vars: {
                ...state.params.vars,
                ...params.reduce<Params['vars']>((acc, param) => {
                    const value = state.params.vars[param.id]
                    if (value !== undefined) {
                        acc[param.id] = Math.max(
                            param.min,
                            Math.min(param.max, value),
                        )
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
                return createDebugger(modifier.stateIds)
            default:
                throw new Error(
                    'Missing modifier type: ' + (modifier as any).type,
                ) // Hack to please the linter
        }
    })
}

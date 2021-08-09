import { stateExtensionsFromData } from './StateExtensions'
import type { WorldState, WorldStateModifier } from './ContentTypes'
import type { StateExtension } from './StateExtensions'
import type { Params, GameState } from './'

export type WorldStateExtension = (worldState: WorldState) => WorldState

function worldStateExtensionFromStateExtension(
    extension: StateExtension,
): WorldStateExtension {
    return (worldState) => {
        const state: GameState<Params> = {
            params: {
                vars: worldState.state,
                flags: worldState.flags,
            },
        }
        const newState = extension(state)

        return {
            state: newState.params.vars,
            flags: newState.params.flags,
        }
    }
}

/**
 * Generate a list of world state extension from a data description
 *
 * @param modifiers Data description of modifiers which can be converted to extensions
 */
export function worldStateExtensionFromData(
    modifiers: WorldStateModifier[],
): WorldStateExtension[] {
    return stateExtensionsFromData(modifiers).map(
        worldStateExtensionFromStateExtension,
    )
}

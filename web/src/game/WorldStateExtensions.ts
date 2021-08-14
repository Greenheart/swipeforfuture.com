import { stateExtensionsFromData } from './StateExtensions'
import type { WorldState, WorldStateModifier } from '$shared/ContentTypes'
import type { Params, GameState, StateExtension } from '.'

export type WorldStateExtension = (worldState: WorldState) => WorldState

function worldStateExtensionFromStateExtension(
    extension: StateExtension,
): WorldStateExtension {
    return (worldState) => {
        const state: GameState<Params> = {
            params: {
                vars: worldState.state,
            },
        }
        const newState = extension(state)

        return {
            state: newState.params.vars,
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

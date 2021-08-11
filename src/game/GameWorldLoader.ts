import type {
    GameWorld,
    GameWorldModifier,
    CardActionData,
    WorldQuery,
} from './ContentTypes'
import type {
    Game,
    GameState,
    Card,
    CardAction,
    StateModifier,
    Stat,
} from './Types'
import { Params, ParamQuery, hasMatchingParamQuery } from './Params'
import { BasicGame } from './BasicGame'
import { stateExtensionsFromData, createParameterCap } from './StateExtensions'

/**
 * Loads a GameWorld object as a Game<Params>.
 * Uses the data structures to generate a runtime description of the game model.
 *
 * @param gameWorld The data definition of the game world
 * @param random A function used for generating random values between 0 and 1
 * @returns A Game<Params> object which uses the given data
 */
export function load(
    gameWorld: GameWorld,
    random: () => number = Math.random,
): Game<Params> {
    const defaultParams = {
        flags: gameWorld.defaultState.flags,
        vars: gameWorld.defaultState.state,
    }
    const cards = Object.values(gameWorld.cards).map<Card<Params>>((data) =>
        cardFromData(data, defaultParams),
    )
    const parameterCaps = parameterCapsFromStats(gameWorld.stats)
    const stats = statsFromData(gameWorld.stats)
    const stateExtensions = stateExtensionsFromData(
        gameWorld.worldStateModifiers,
    )
    return new BasicGame<Params>([...cards], stats, defaultParams, {
        tickModifiers: [ ...stateExtensions, parameterCaps],
        random,
    })
}

/**
 * Creates a list of Stat<Params> from GameWorld data
 *
 * @param stats The stats data
 * @returns A list of Stats
 */
function statsFromData(stats: GameWorld['stats']): Stat<Params>[] {
    return stats.map<Stat<Params>>((stat) => ({
        ...stat,
        getValue: ({ params }) => params.vars[stat.id] ?? 0,
    }))
}

/**
 * Creates the standard parameters caps used for a standard GameWorld
 *
 * @param stats The stats data
 * @returns A stat modifier which caps all the vars matched to ids in stats to [0, 100]
 */
function parameterCapsFromStats(stats: GameWorld['stats']) {
    const statVarIds = stats.map((stat) => stat.id)
    return createParameterCap(statVarIds, 0, 100)
}

/**
 * Creates a Card<Params> from regular card data or event card data
 *
 * @param data The card data
 * @param defaultParams The default parameters to use for state reset
 * @returns A runtime model of a card
 */
function cardFromData(
    data: GameWorld['cards'][number],
    defaultParams: Params,
): Card<Params> {
    const paramQueries = (
        'isAvailableWhen' in data ? data.isAvailableWhen : []
    ).map(worldQueryToParamQuery)
    return {
        image: data.image,
        title: data.title,
        text: data.text,
        location: data.location,
        match: (s) => hasMatchingParamQuery(s.params, paramQueries),
        weight: data.weight,
        actions: {
            left: actionFromData(data.actions.left, defaultParams, 'No'),
            right: actionFromData(data.actions.right, defaultParams, 'Yes'),
        },
    }
}

/**
 * Creates a card action from CardActionData
 *
 * @param data
 * @param defaultParams Default params to use when resetting state
 * @param defaultDescription The default description in case it is missing in data
 * @returns A card action with description and param modifier
 */
function actionFromData(
    data: CardActionData,
    defaultParams: Params,
    defaultDescription: string,
): CardAction<Params> {
    return {
        description: data.description ?? defaultDescription,
        modifier: (state) => updateParams(state, data.modifiers, defaultParams),
    }
}

/**
 * Converts a WorldQuery to a ParamQuery
 *
 * @param query The WorldQuery
 * @returns A ParamQuery representing the input WorldQuery
 */
function worldQueryToParamQuery(query: WorldQuery): ParamQuery {
    return {
        vars: query.state,
        flags: query.flags,
    }
}

/**
 * Updates the params of a GameState given a GameWorldModifier
 *
 * @param state The input GameState
 * @param modifier The modifier data description
 * @param defaultParams Default params to use for a state reset
 * @returns The updated GameState
 */
function updateParams(
    state: GameState<Params>,
    modifiers: GameWorldModifier[],
    defaultParams: Params,
): GameState<Params> {
    return {
        ...state,
        params: {
            vars: modifiers.reduce(
                (acc, modifier) =>
                    updateVars(acc, modifier, defaultParams.vars),
                state.params.vars,
            ),
            flags: modifiers.reduce(
                (acc, modifier) =>
                    updateFlags(acc, modifier, defaultParams.flags),
                state.params.flags,
            ),
        },
    }
}

function updateVars(
    params: Params['vars'],
    modifier: GameWorldModifier,
    defaultVars: Params['vars'],
): Params['vars'] {
    const currentVars: Params['vars'] =
        modifier.type === 'replace'
            ? Object.assign({}, defaultVars)
            : Object.assign({}, params)

    const stateModifier = modifier.state || {}
    const updatedWorldState = Object.entries(stateModifier).reduce<
        Params['vars']
    >((updatedState, [key, value]) => {
        const newValue =
            modifier.type === 'set' || modifier.type === 'replace'
                ? value
                : value + (updatedState[key] || 0)

        updatedState[key] = Math.min(Math.max(newValue, 0), 100)

        return updatedState
    }, currentVars)

    return updatedWorldState
}

function updateFlags(
    flags: Params['flags'],
    modifier: GameWorldModifier,
    defaultFlags: Params['flags'],
): Params['flags'] {
    const currentFlags: Params['flags'] =
        modifier.type === 'replace'
            ? Object.assign({}, defaultFlags)
            : Object.assign({}, flags)

    const flagsModifier = modifier.flags || {}
    const updatedWorldFlags = Object.entries(flagsModifier).reduce<
        Params['flags']
    >((updatedFlags, [key, value]) => {
        updatedFlags[key] = value
        return updatedFlags
    }, currentFlags)

    return updatedWorldFlags
}

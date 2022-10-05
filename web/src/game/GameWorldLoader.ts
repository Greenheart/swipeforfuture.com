import type {
    GameWorld,
    GameWorldModifier,
    CardActionData,
    WorldQuery,
} from '$shared/ContentTypes'
import type {
    Game,
    GameState,
    Card,
    CardAction,
    Stat,
    StateModifier,
    CardsMap,
} from './Types'
import { hasMatchingParamQuery } from './Params'
import type { Params, ParamQuery } from './Params'
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
        vars: gameWorld.defaultState.state,
    }

    const cardsMap = gameWorld.cards.reduce<
        Record<GameWorld['cards'][number]['id'], GameWorld['cards'][number]>
    >((map, card) => {
        map[card.id] = card
        return map
    }, {})

    const cards = cardsFromData(cardsMap, defaultParams)
    console.log(`Loaded cards:`, cards)

    // Idea: Preload all images by adding them as links to <head>

    const parameterCaps = parameterCapsFromStats(gameWorld.stats)
    const stats = statsFromData(gameWorld.stats)
    const stateExtensions = stateExtensionsFromData(
        gameWorld.worldStateModifiers,
    )
    return new BasicGame<Params>(Object.values(cards), stats, defaultParams, {
        // After each swipe, run the tickModifiers to perform common tasks.
        // NOTE: Ensure parameterCaps runs before debug logging and the other StateExtensions
        tickModifiers: [parameterCaps, ...stateExtensions],
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
 * @returns A stat modifier which caps all the vars matched to ids in stats to their respective [min, max]
 */
function parameterCapsFromStats(stats: GameWorld['stats']) {
    return createParameterCap(stats)
}

/**
 * Creates a Card<Params> from card data
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
        id: data.id,
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
        priority: data.priority,
    }
}

/**
 * Creates a map of cards, linked together
 *
 * @param cardsMap A map of all cards
 * @param defaultParams Default params to use for a state reset
 * @returns A map of all runtime cards
 */
function cardsFromData(
    cardsMap: Record<
        GameWorld['cards'][number]['id'],
        GameWorld['cards'][number]
    >,
    defaultParams: Params,
): CardsMap<Params> {
    const cards = Object.keys(cardsMap).reduce<CardsMap<Params>>((acc, key) => {
        const data = cardsMap[key]
        acc[key] = cardFromData(data, defaultParams)
        return acc
    }, {})

    for (const cardId in cards) {
        const data = cardsMap[cardId]
        const card = cards[cardId]

        card.actions.left.modifier = cardChain(
            data.actions.left,
            cards,
            card.actions.left.modifier,
        )
        card.actions.right.modifier = cardChain(
            data.actions.right,
            cards,
            card.actions.right.modifier,
        )
    }
    return cards
}

/**
 * Completes a card action modifier by adding trigger for next card
 * in case a `next` card id is specified
 *
 * @param data The action data
 * @param cards A map of all cards
 * @param modifier The current modifier without card trigger
 * @returns A StateModifier with conditionally added next card trigger
 */
function cardChain(
    data: CardActionData,
    cardsMap: CardsMap<Params>,
    modifier: StateModifier<Params>,
): StateModifier<Params> {
    const targetCard = data.next ? cardsMap[data.next] : undefined
    return targetCard
        ? (state) => ({
              ...modifier(state),
              card: targetCard,
          })
        : modifier
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
        next: data.next,
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

        updatedState[key] = newValue

        return updatedState
    }, currentVars)

    return updatedWorldState
}

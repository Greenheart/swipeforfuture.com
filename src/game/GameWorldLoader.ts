import {
    GameWorld,
    GameWorldModifier,
    CardActionData,
    EventCardActionData,
    WorldQuery,
} from './ContentTypes'
import { Game, GameState, Card, CardAction, StateModifier, Stat } from './Types'
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
    const cards = gameWorld.cards.map<Card<Params>>((data) =>
        cardFromData(data, defaultParams),
    )
    const eventCards = eventCardsFromData(gameWorld.eventCards, defaultParams)
    const events: StateModifier<Params>[] = gameWorld.events.map((event) => {
        const card = eventCards[event.initialEventCardId]
        return eventFromData(event, card, random)
    })
    const parameterCaps = parameterCapsFromStats(gameWorld.stats)
    const stats = statsFromData(gameWorld.stats)
    const stateExtensions = stateExtensionsFromData(
        gameWorld.worldStateModifiers,
    )
    return new BasicGame<Params>([...cards], stats, defaultParams, {
        tickModifiers: [...events, ...stateExtensions, parameterCaps],
        random,
    })
}

/**
 * Creates a StateModifier representing an event using data from GameWorld
 *
 * @param event The event data
 * @param card The card to which the event should be linked
 * @param random The random function used for the probability check
 * @returns An event trigger in the form of a StateModifier
 */
function eventFromData(
    event: GameWorld['events'][number],
    card: Card<Params>,
    random: () => number,
): StateModifier<Params> {
    const paramQueries = event.isAvailableWhen.map(worldQueryToParamQuery)
    return (state) => {
        const noPreviousCardSetter = !state.card
        const propabilityHit = random() <= event.probability
        const shouldExecute =
            noPreviousCardSetter &&
            propabilityHit &&
            hasMatchingParamQuery(state.params, paramQueries)
        return shouldExecute
            ? {
                  ...state,
                  card: card,
              }
            : state
    }
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
    data: GameWorld['cards'][number] | GameWorld['eventCards'][string],
    defaultParams: Params,
): Card<Params> {
    const paramQueries = ('isAvailableWhen' in data
        ? data.isAvailableWhen
        : []
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
 * Creates a map of event cars from GameWorlds event card data
 *
 * @param eventCardsData The event card data
 * @param defaultParams Default params to use for a state reset
 * @returns A map of event cards
 */
function eventCardsFromData(
    eventCardsData: GameWorld['eventCards'],
    defaultParams: Params,
): { [x: string]: Card<Params> } {
    const eventCards = Object.keys(eventCardsData).reduce<{
        [x: string]: Card<Params>
    }>((acc, key) => {
        const data = eventCardsData[key]
        acc[key] = cardFromData(data, defaultParams)
        return acc
    }, {})

    for (const cardId in eventCards) {
        const data = eventCardsData[cardId]
        const eventCard = eventCards[cardId]

        eventCard.actions.left.modifier = eventCardChain(
            data.actions.left,
            eventCards,
            eventCard.actions.left.modifier,
        )
        eventCard.actions.right.modifier = eventCardChain(
            data.actions.right,
            eventCards,
            eventCard.actions.right.modifier,
        )
    }
    return eventCards
}

/**
 * Completes an event card action modifier by adding trigger for next card
 * in case a nextEventCardId is specified
 *
 * @param data The action data
 * @param eventCards An event cards map
 * @param modifier The current modifier without card trigger
 * @returns A StateModifier with conditionally added next card trigger
 */
function eventCardChain(
    data: EventCardActionData,
    eventCards: { [x: string]: Card<Params> },
    modifier: StateModifier<Params>,
): StateModifier<Params> {
    const targetCard =
        data.nextEventCardId !== null ? eventCards[data.nextEventCardId] : null
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

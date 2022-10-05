import type { Game, GameState, StateModifier, Card, Stat } from './Types'

export type GameOptions<P> = {
    random: () => number
    tickModifiers: StateModifier<P>[]
}

export class BasicGame<P> implements Game<P> {
    protected _cards: Card<P>[]
    protected _random: () => number
    protected _tickModifiers: StateModifier<P>[]
    protected _stats: Stat<P>[]
    protected _initialParams: P

    constructor(
        cards: Card<P>[],
        stats: Stat<P>[],
        initialParams: P,
        options: Partial<GameOptions<P>> = {},
    ) {
        const { random = Math.random, tickModifiers = [] } = options
        this._cards = cards
        this._random = random
        this._tickModifiers = tickModifiers
        this._initialParams = initialParams
        this._stats = stats
    }

    get stats() {
        return this._stats
    }

    get initialState(): GameState<P> {
        return this.applyAction(
            {
                params: this._initialParams,
            } as unknown as GameState<P>,
            (s) => s,
        )
    }

    get preloadAssets() {
        return this._cards.map((c) => c.image)
    }

    applyAction(state: GameState<P>, action: StateModifier<P>): GameState<P> {
        const nextState = this._applyModifiers(
            {
                ...state,
                card: undefined as unknown as Card<P>,
            },
            [action, ...this._tickModifiers],
        )
        return nextState.card
            ? nextState
            : {
                  ...nextState,
                  card: this._selectWeightedRandomFrom(
                      this._getAvailableCards(nextState),
                  ),
              }
    }

    private _applyModifiers(
        state: GameState<P>,
        modifiers: StateModifier<P>[],
    ): GameState<P> {
        return modifiers.reduce((acc, modifier) => modifier(acc), state)
    }

    private _getAvailableCards(state: GameState<P>): Card<P>[] {
        // First do regular matching based on game state.
        const allAvailable = this._cards.filter((c) => c.match(state))

        const cardsByPriority: Record<number, Card<P>[]> = {}

        for (const card of allAvailable) {
            cardsByPriority[card.priority] = cardsByPriority[card.priority]
                ? cardsByPriority[card.priority].concat(card)
                : [card]
        }

        // Then select the available set of cards with the highest priority.
        let highestPriority = Math.min(
            ...Object.keys(cardsByPriority).map((n) => parseInt(n, 10)),
        )
        return cardsByPriority[highestPriority]
    }

    private _selectWeightedRandomFrom<T extends { weight: number }>(
        array: T[],
        weightFunc = (element: T) => element.weight,
    ): T {
        const { selectionList, count } = array.reduce<{
            count: number
            selectionList: number[]
        }>(
            (acc, element) => {
                acc.count += weightFunc(element)
                acc.selectionList.push(acc.count)
                return acc
            },
            { count: 0, selectionList: [] },
        )

        const selectionPosition = this._random() * count
        const selectionIndex = selectionList.findIndex((max, index, array) => {
            const min = index > 0 ? array[index - 1] : 0
            return selectionPosition >= min && selectionPosition <= max
        })

        return array[selectionIndex]
    }
}

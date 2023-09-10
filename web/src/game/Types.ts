export type Stat<P> = {
    getValue: (state: GameState<P>) => number
    /**
     * Get the indicator to help the player understand how an action would impact the game state.
     */
    getIndicator: (
        state: GameState<P>,
        action: StateModifier<P>,
    ) => number | 'unknown'
    id: string
    name: string
    icon: {
        src: string
        size?: string
    }
}

export type StateModifier<P> = ((state: GameState<P>) => GameState<P>) & {
    disabledDuringPreview?: boolean
}

export type IndicatorState = 'visible' | 'hidden' | 'unknown'

export interface CardAction<P> {
    description: string
    indicatorState: IndicatorState
    modifier: StateModifier<P>
    next?: Card<P>['id']
}

export type CardPresentation = {
    image: string
    title: string
    text: string
    location: string
    actions: {
        left: {
            description: string
        }
        right: {
            description: string
        }
    }
}

export interface Card<P> extends CardPresentation {
    id: string
    match(state: GameState<P>): boolean
    weight: number
    actions: {
        left: CardAction<P>
        right: CardAction<P>
    }
    priority: number
}

export type CardsMap<P> = Record<Card<P>['id'], Card<P>>

export type GameState<P> = {
    card: Card<P>
    params: P
}

/**
 * Change how actions are applied.
 */
export type ApplyActionOptions = {
    /**
     * Enabled when calculating action indicators.
     */
    isPreview?: boolean
}

export interface Game<P> {
    initialState: GameState<P>
    applyAction(
        prevState: GameState<P>,
        action: StateModifier<P>,
        options: ApplyActionOptions,
    ): GameState<P>
    stats: Stat<P>[]
    /**
     * List of URLs to preload, for example images and other static assets.
     */
    preloadAssets: string[]
}

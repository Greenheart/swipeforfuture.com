export type Stat<P> = {
    getValue: (state: GameState<P>) => number
    id: string
    name: string
    icon: string
    iconSize?: string
}

export type StateModifier<P> = (state: GameState<P>) => GameState<P>

export interface CardAction<P> {
    description: string
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
    card?: Card<P>
    params: P
}

export interface Game<P> {
    initialState: GameState<P>
    applyAction(prevState: GameState<P>, action: StateModifier<P>): GameState<P>
    stats: Stat<P>[]
}

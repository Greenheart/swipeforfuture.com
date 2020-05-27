import { CardData } from '../../src/game/ContentTypes'

// HACK: This useless import + function is required for this to count as an ES module, so we can run it
function noop(c: CardData): CardData {
    return c
}

export function run() {
    return 'A true utopian scenario, wow!'
}

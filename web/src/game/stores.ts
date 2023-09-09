import { writable } from 'svelte/store'

/**
 * If set, these numbers show how the current action would affect the game state.
 */
export const consequenceIndicators = writable<number[] | null>(null)

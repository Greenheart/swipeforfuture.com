import { writable } from 'svelte/store'

export const currentAction = writable<'left' | 'right' | undefined>()

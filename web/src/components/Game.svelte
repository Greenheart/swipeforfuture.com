<script lang="ts" context="module">
    import { writable } from 'svelte/store'

    import CardView from '$components/CardView.svelte'
    import Stats from '$components/Stats.svelte'
    import { SwipeDirection, SWIPE_DELAY } from '$util/constants'
    import type { GameState, Game as GameLogic, Stat } from '$game/Types'
import { onMount } from 'svelte';
</script>

<script lang="ts">
    // NOTE: Should these generic types use any or something more specific?
    export let game: GameLogic<any>

    const state = writable<GameState<any>>(game.initialState)

    let stats: Array<Stat<any> & { value: number }>

    $: {
        stats = game.stats.map((stat) =>
            Object.assign({}, stat, {
                value: stat.getValue($state),
            }),
        )
    }

    function onSwipe(direction: SwipeDirection): Promise<void> {
        if (!$state.card) return Promise.resolve()

        const action =
            direction === SwipeDirection.Left
                ? $state.card.actions.left.modifier
                : $state.card.actions.right.modifier

        return new Promise((resolve) => {
            setTimeout(() => {
                $state = game.applyAction($state, action)
                resolve()
            }, SWIPE_DELAY)
        })
    }

    function noop(e: Event) {
        e.preventDefault()
        e.stopPropagation()
        return false
    }

    onMount(
        () => {
            document.documentElement.classList.add('in-game')
            return () => document.documentElement.classList.remove('in-game')
        }
    )
</script>

<main class="text-white" on:contextmenu={noop} on:dragstart={noop} on:select={noop}>
    <Stats {stats} />

    {#if $state.card}
        <CardView card={$state.card} {onSwipe} />
    {/if}
</main>

<script lang="ts" context="module">
    import { writable } from 'svelte/store'

    import CardView from '$components/CardView.svelte'
    import Stats from '$components/Stats.svelte'
    import { SwipeDirection, SWIPE_DELAY } from '$util/constants'
    import type { GameState, Game as GameLogic, Stat } from '$game/Types'
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
</script>

<main class="text-white">
    <Stats {stats} />

    {#if $state.card}
        <CardView card={$state.card} {onSwipe} />
    {/if}
</main>

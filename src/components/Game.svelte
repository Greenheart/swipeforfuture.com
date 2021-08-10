<script lang="ts" context="module">
    import { writable } from 'svelte/store'

    import CardView from '$components/CardView.svelte'
    import Stats from '$components/Stats.svelte'
    import { SwipeDirection } from '$util/constants'
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

    function onSwipe(direction: SwipeDirection): void {
        if (!$state.card) return

        const action =
            direction === SwipeDirection.Left
                ? $state.card.actions.left.modifier
                : $state.card.actions.right.modifier

        $state = game.applyAction($state, action)
    }
</script>

<main class="text-white">
    <Stats {stats} />

    {#if $state.card}
        <CardView card={$state.card} {onSwipe} />
    {/if}
</main>

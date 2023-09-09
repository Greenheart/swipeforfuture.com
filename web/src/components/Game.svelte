<script lang="ts" context="module">
    import { writable } from 'svelte/store'
    import { onMount } from 'svelte'

    import CardView from '$components/CardView.svelte'
    import Stats from '$components/Stats.svelte'
    import { SwipeDirection } from '$util/constants'
    import type { GameState, Game as GameLogic, Stat } from '$game/Types'
</script>

<script lang="ts">
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

    function onSwipe(direction: SwipeDirection) {
        const action =
            direction === SwipeDirection.Left
                ? $state.card.actions.left.modifier
                : $state.card.actions.right.modifier

        $state = game.applyAction($state, action)
    }

    function noop(e: Event) {
        e.preventDefault()
        e.stopPropagation()
        return false
    }

    onMount(() => {
        document.documentElement.classList.add('in-game')
        return () => document.documentElement.classList.remove('in-game')
    })
</script>

<svelte:head>
    {#each game.preloadAssets as href}
        <link rel="preload" as="image" {href} />
    {/each}
</svelte:head>

<main class="text-white" on:dragstart={noop} on:select={noop}>
    <Stats {stats} />

    {#if $state.card}
        <CardView card={$state.card} {onSwipe} />
    {/if}
</main>

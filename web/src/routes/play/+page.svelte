<script lang="ts" context="module">
    import { onMount } from 'svelte'

    import { Game } from '$components'
    import { loadScenario } from '$game/load-scenario'
    import { load } from '$game/GameWorldLoader'
    import { SFF_DEFAULT_SCENARIO } from '$util/constants'
</script>

<script lang="ts">
    let path: string

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search)
        // Use the `?dev=[SCENARIO_ID]` query param to simplify local development
        // For example: http://localhost:3000/play?dev=default
        const devScenario = urlParams.get('dev')
        const devPath = devScenario
            ? `//${window.location.host}/dev-only/${devScenario}.json`
            : undefined
        path = devPath ? devPath : urlParams.get('path') ?? SFF_DEFAULT_SCENARIO
    })

    async function fetchWorld(path: string) {
        const scenarioData = await loadScenario(path)
        if (scenarioData) {
            return load(scenarioData)
        } else {
            throw new Error(`Could not load scenario data: ${path}`)
        }
    }
</script>

{#if path}
    {#await fetchWorld(path) then game}
        <Game {game} />
    {/await}
{:else}
    <p
        class="grid place-items-center text-white font-black text-2xl tracking-widest h-[60vh]"
    >
        Loading...
    </p>
{/if}

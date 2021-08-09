<script lang="ts" context="module">
    import { loadScenario } from '$game/load-scenario'
    import { load } from '$game/GameWorldLoader'
    import { SFF_DEFAULT_SCENARIO } from '$util/constants'
    import { onMount } from 'svelte'
</script>

<script lang="ts">
    let path: string

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search)
        path = urlParams.get('path') ?? SFF_DEFAULT_SCENARIO
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
    {#await fetchWorld(path)}
        <p>Loading...</p>
    {:then game}
        <div>Play, {game}</div>
    {/await}
{/if}

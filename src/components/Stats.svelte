<script lang="ts" context="module">
    import Bar from '$components/Bar.svelte'
    import type { Stat } from '$game/Types'

    // TODO: Improve how icons are loaded and handled. Maybe bundle together with the scenario itself.
</script>

<script lang="ts">
    export let stats: Array<Stat<any> & { value: number }>
</script>

<header class="flex bg-green-700 space-x-8 justify-center items-center p-4">
    {#each stats as stat}
        <div class="flex justify-between items-center flex-col">
            <div
                class="w-12 h-12 rounded-full bg-white grid place-items-center shadow-lg mb-3 text-black"
            >
                {stat.name.slice(0, 2)}
            </div>
            <Bar value={stat.value} />
        </div>
    {/each}
</header>

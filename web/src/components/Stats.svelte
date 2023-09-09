<script lang="ts" context="module">
    import Bar from '$components/Bar.svelte'
    import type { Stat } from '$game/Types'
</script>

<script lang="ts">
    export let stats: Array<Stat<any> & { value: number }>
</script>

<header
    class="flex bg-green-700 xs:space-x-10 justify-around xs:justify-center items-center p-2 2xs:p-4 shadow-lg"
>
    {#each stats as stat}
        <div
            class="flex justify-between items-center flex-col"
            title={stat.name}
        >
            <div
                class="w-8 h-8 2xs:w-10 2xs:h-10 xs:w-12 xs:h-12 rounded-full bg-white grid place-items-center shadow-lg mb-2 xs:mb-3 text-black text-sm"
            >
                <img
                    src={stat.icon.src}
                    class="w-full h-full object-contain"
                    alt="{stat.name} icon"
                    style:width={stat.icon.size ? stat.icon.size : ''}
                    style:height={stat.icon.size ? stat.icon.size : ''}
                />
            </div>
            <Bar value={stat.value} />
        </div>
    {/each}
</header>

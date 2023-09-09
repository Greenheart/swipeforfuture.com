<script lang="ts" context="module">
    import { Bar } from '$components'
    import type { Stat } from '$game/Types'
    import QuestionMark from '~icons/heroicons/question-mark-circle-20-solid'
</script>

<script lang="ts">
    import { currentAction } from '$game/stores'

    export let stats: Array<
        Stat<any> & {
            value: number
            /**
             * If set, these numbers show how the current action would affect the game state.
             */
            indicators: { left: number | 'unknown'; right: number | 'unknown' }
        }
    >
</script>

<header
    class="flex bg-green-700 xs:space-x-10 justify-around xs:justify-center items-center p-2 2xs:p-4 shadow-lg"
>
    {#each stats as stat (stat.name)}
        <div
            class="flex justify-between items-center flex-col"
            title={stat.name}
        >
            <div
                class="w-8 h-8 2xs:w-10 2xs:h-10 xs:w-12 xs:h-12 rounded-full bg-white grid place-items-center shadow-lg mb-2 xs:mb-3 text-black text-sm relative"
            >
                <img
                    src={stat.icon.src}
                    class="w-full h-full object-contain"
                    alt="{stat.name} icon"
                    style:width={stat.icon.size ? stat.icon.size : ''}
                    style:height={stat.icon.size ? stat.icon.size : ''}
                />
                {#if $currentAction}
                    {@const indicator = stat.indicators[$currentAction]}
                    {#if indicator === 'unknown'}
                        <div
                            class="text-black text-base rounded-full aspect-square bg-white absolute top-0 -translate-y-1/2"
                        >
                            <QuestionMark />
                        </div>
                    {:else if indicator !== 0}
                        <div
                            style:width={indicator > 0 ? '30%' : '20%'}
                            class="bg-black rounded-full aspect-square absolute {indicator >
                            0
                                ? 'top-0 -translate-y-1/2'
                                : 'bottom-0 translate-y-1/2'}"
                        />
                    {/if}
                {/if}
            </div>
            <Bar value={stat.value} />
        </div>
    {/each}
</header>

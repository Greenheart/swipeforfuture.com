<script lang="ts" context="module">
    import { spring } from 'svelte/motion'

    import {
        SwipeDirection,
        SWIPE_THRESHOLD,
        SWIPE_DELAY,
    } from '$util/constants'
    import pannable from '$util/pannable'
    import type { CardPresentation } from '$game/Types'
    import { currentAction } from '$game/stores'

    const transition = `transition: transform ${SWIPE_DELAY}ms ease-out`
    const actionIds: ('left' | 'right')[] = ['left', 'right']
</script>

<script lang="ts">
    export let onSwipe: (direction: SwipeDirection) => void
    export let actions: CardPresentation['actions']
    export let imageSize: string
    let isMovingOut = false
    let dir: SwipeDirection | undefined
    let borderWidth = ''

    const coords = spring(
        { x: 0, y: 0 },
        {
            stiffness: 0.2,
            damping: 0.4,
        },
    )

    function handlePanStart() {
        coords.stiffness = coords.damping = 1
    }

    function handlePanMove(event: PanEvent) {
        coords.update(() => ({
            x: $coords.x + event.detail.dx,
            y: $coords.y + event.detail.dy,
        }))

        dir = Math.sign(event.detail.totalDeltaX)

        if (Math.abs(event.detail.totalDeltaX) > 0.25 * SWIPE_THRESHOLD) {
            $currentAction = dir < 0 ? 'left' : 'right'
        } else {
            $currentAction = undefined
        }
    }

    function swipe(direction: SwipeDirection): Promise<void> {
        return new Promise<void>(function (resolve) {
            setTimeout(function () {
                onSwipe(direction)
                resolve()
            }, SWIPE_DELAY)
        })
    }

    async function handlePanEnd(event: PanEvent) {
        $currentAction = undefined

        if (
            Math.abs(event.detail.totalDeltaX) > SWIPE_THRESHOLD &&
            dir !== undefined
        ) {
            isMovingOut = true
            $coords.x =
                (event.target as HTMLDivElement).clientWidth +
                Math.max(window.innerHeight, window.innerWidth) * dir
            await swipe(dir)
            isMovingOut = false
        } else {
            coords.stiffness = 0.2
            coords.damping = 0.8
        }
        dir = undefined
        coords.set({ x: 0, y: 0 })
    }
</script>

<div
    class="shadow-md rounded-md cursor-move select-none relative"
    use:pannable
    on:panstart={handlePanStart}
    on:panmove={handlePanMove}
    on:panend={handlePanEnd}
    style="transform:
        translate3d({$coords.x}px, {$coords.y}px, 0)
        rotate3d(0, 0, 1, {$coords.x * 0.05}deg);
        {isMovingOut ? transition : ''}"
>
    <!-- TODO: tweak styles for how the action descriptions are displayed -->
    {#if dir}
        <div
            class="absolute overflow-hidden {imageSize}"
            style="transition: border-width 0.2s;
                border-color: #fff;
                border-style: solid;
                border-width: {borderWidth};"
        >
            {#each actionIds as actionId}
                <div
                    class="absolute top-[-50%] left-[50%] w-[200%]"
                    style="transform:
                        translate3d(-50%, 0, 0) rotate3d(0, 0, 1, {$coords.x *
                        -0.05}deg);
                        transition: opacity 0.2s;
                        opacity: {actionId === $currentAction ? 1 : 0};
                        overflow: hidden;"
                >
                    <span
                        class="relative block bg-black bg-opacity-80 text-md w-[100%] px-[30%] py-[5%] pt-[30%]"
                        style="text-shadow: 0 2px 4px #000;
                            text-align: {actionId === 'left'
                            ? 'right'
                            : 'left'};
                            transition: transform 0.2s;
                            transform: translate3d(0, {actionId ===
                        $currentAction
                            ? '0'
                            : '-10px'}, 0);"
                    >
                        {actions[actionId].description}
                    </span>
                </div>
            {/each}
        </div>
    {/if}

    <slot />
</div>

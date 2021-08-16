<script lang="ts" context="module">
    import { spring } from 'svelte/motion'

    import {
        SwipeDirection,
        SWIPE_THRESHOLD,
        SWIPE_DELAY,
    } from '$util/constants'
    import pannable from '$util/pannable'
    import type { CardPresentation } from '$game/Types'

    const transition = `transition: transform ${SWIPE_DELAY}ms ease-out`
</script>

<script lang="ts">
    export let onSwipe: (direction: SwipeDirection) => void
    export let actions: CardPresentation['actions']
    export let imageSize: string
    let isMovingOut = false
    let dir: SwipeDirection | undefined
    let opacity = 0
    let borderWidth = ""

    const coords = spring(
        { x: 0, y: 0 },
        {
            stiffness: 0.2,
            damping: 0.4,
        },
    )

    function handlePanStart() {
        coords.stiffness = coords.damping = 1
        borderWidth = "2px"
    }

    function handlePanMove(event: PanEvent) {
        coords.update(() => ({
            x: $coords.x + event.detail.dx,
            y: $coords.y + event.detail.dy,
        }))

        if (event.detail.totalDeltaX > 0) {
            dir = SwipeDirection.Right
        } else if (event.detail.totalDeltaX < 0) {
            dir = SwipeDirection.Left
        }


        if (Math.abs(event.detail.totalDeltaX) > 0.25 * SWIPE_THRESHOLD) {
            opacity = 1
        } else {
            opacity = 0
        }
    }

    function swipe(
        direction: SwipeDirection,
        targetX: number
    ) {
        isMovingOut = true
        $coords.x = targetX
        setTimeout(
            function() {
                onSwipe(direction)
                isMovingOut = false
                coords.set({ x: 0, y: 0 })
            },
            SWIPE_DELAY
        )
    }

    function handlePanEnd(event: PanEvent) {
        dir = undefined
        opacity = 0

        if (event.detail.totalDeltaX > SWIPE_THRESHOLD) {
            swipe(
                SwipeDirection.Right,
                (event.target as HTMLDivElement).clientWidth + Math.max(window.innerHeight, window.innerWidth) * SwipeDirection.Right
            )
        } else if (event.detail.totalDeltaX < -SWIPE_THRESHOLD) {
            swipe(
                SwipeDirection.Left,
                (event.target as HTMLDivElement).clientWidth + Math.max(window.innerHeight, window.innerWidth) * SwipeDirection.Left
            )
        } else {
            coords.stiffness = 0.2
            coords.damping = 0.8
            coords.set({ x: 0, y: 0 })
        }
        borderWidth = "0px"
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
        rotate({$coords.x * 0.05}deg);
        {isMovingOut ? transition : ''}"
>
    <!-- TODO: tweak styles for how the action descriptions are displayed -->
    {#if dir}
        <div class="absolute overflow-hidden {imageSize}"
            style="transition: border-width 0.2s;
                border-color: #fff;
                border-style: solid;
                border-width: {borderWidth};"
        >
            <div
                class="absolute top-[-20%] left-[50%] w-[160%]"
                style="transform:
                    translateX(-50%) rotate({$coords.x * -0.05}deg);
                    overflow: hidden;"
            >
                <span
                    class="relative block bg-black bg-opacity-80 text-md w-[100%] px-[25%] py-[5%] pt-[20%]"
                    style="text-shadow: 0 2px 4px #000;
                        text-align: right;
                        transition: transform 0.2s;
                        transform: translateY({dir === 1 && opacity ? "0%" : "-100%"});"
                >
                    {actions.right.description}
                </span>
            </div>
            <div
                class="absolute top-[-20%] left-[50%] w-[160%]"
                style="transform:
                    translateX(-50%) rotate({$coords.x * -0.05}deg);
                    overflow: hidden;"
            >
                <span
                    class="relative block bg-black bg-opacity-80 text-md w-[100%] px-[25%] py-[5%] pt-[20%]"
                    style="text-shadow: 0 2px 4px #000;
                        text-align: left;
                        transition: transform 0.2s;
                        transform: translateY({dir === -1 && opacity ? "0%" : "-100%"});"
                >
                    {actions.left.description}
                </span>
            </div>
            
        </div>
    {/if}

    <slot />
</div>

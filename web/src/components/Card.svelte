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
    let response = ''
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
            response = actions.right.description
            dir = SwipeDirection.Right
        } else if (event.detail.totalDeltaX < 0) {
            response = actions.left.description
            dir = SwipeDirection.Left
        }


        if (Math.abs(event.detail.totalDeltaX) > 0.5 * SWIPE_THRESHOLD) {
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
        response = ''
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
    {#if response && dir}
        <div class="absolute overflow-hidden {imageSize}"
            style="transition: border-width 0.2s;
                border-color: #fff;
                border-style: solid;
                border-width: {borderWidth};"
        >
            <div
                class="absolute left-[50%] top-[-20%] bg-black bg-opacity-80 text-md w-[160%] px-[40%] py-[10%] pt-[30%]"
                style="transform:
                    translateX(-50%) rotate({$coords.x * -0.05}deg);
                    transition: opacity 0.2s;
                    opacity: {opacity};"
            >
                <span
                    class=""
                    style="text-shadow: 0 2px 4px #000"
                >
                    {response}
                </span>
            </div>
        </div>
    {/if}

    <slot />
</div>

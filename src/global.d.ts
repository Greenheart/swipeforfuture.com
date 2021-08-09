/// <reference types="@sveltejs/kit" />

type PanEvent = CustomEvent<{
    x: number
    y: number
    startX: number
    startY: number
    dx: number
    dy: number
    totalDeltaX: number
    totalDeltaY: number
}>

type PanStartEvent = CustomEvent<{
    x: number
    y: number
    startX: number
    startY: number
}>

declare namespace svelte.JSX {
    interface HTMLProps<T> {
        onpanstart?: (event: PanStartEvent) => void
        onpanmove?: (event: PanEvent) => void
        onpanend?: (event: PanEvent) => void
    }
}

export function pannable(node: HTMLElement) {
    let x: number
    let y: number

    let startX: number
    let startY: number

    function handleMousedown(event: MouseEvent) {
        x = event.clientX
        y = event.clientY
        startX = x
        startY = y

        node.dispatchEvent(
            new CustomEvent('panstart', {
                detail: {
                    x,
                    y,
                    startX,
                    startY,
                },
            }),
        )

        window.addEventListener('mousemove', handleMousemove)
        window.addEventListener('mouseup', handleMouseup)
    }

    function handleMousemove(event: MouseEvent) {
        const dx = event.clientX - x
        const dy = event.clientY - y
        const totalDeltaX = event.clientX - startX
        const totalDeltaY = event.clientY - startY

        x = event.clientX
        y = event.clientY

        node.dispatchEvent(
            new CustomEvent('panmove', {
                detail: {
                    x,
                    y,
                    dx,
                    dy,
                    startX,
                    startY,
                    totalDeltaX,
                    totalDeltaY,
                },
            }),
        )
    }

    function handleMouseup(event: MouseEvent) {
        const dx = event.clientX - x
        const dy = event.clientY - y
        const totalDeltaX = event.clientX - startX
        const totalDeltaY = event.clientY - startY

        x = event.clientX
        y = event.clientY

        node.dispatchEvent(
            new CustomEvent('panend', {
                detail: {
                    x,
                    y,
                    dx,
                    dy,
                    startX,
                    startY,
                    totalDeltaX,
                    totalDeltaY,
                },
            }),
        )

        window.removeEventListener('mousemove', handleMousemove)
        window.removeEventListener('mouseup', handleMouseup)
    }

    node.addEventListener('mousedown', handleMousedown)

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMousedown)
        },
    }
}

export type PanEvent = CustomEvent<{
    x: number
    y: number
    dx: number
    dy: number
    totalDeltaX: number
    totalDeltaY: number
    startX: number
    startY: number
}>

export type PanStartEvent = CustomEvent<{
    x: number
    y: number
    startX: number
    startY: number
}>

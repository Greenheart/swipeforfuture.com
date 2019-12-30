import { useEffect } from 'react'

export const useKeyboardEvent = (key, callback) => {
    useEffect(() => {
        const handler = function(event) {
            if (event.key === key) {
                callback()
            }
        }
        window.addEventListener('keydown', handler)
        return () => {
            window.removeEventListener('keydown', handler)
        }
    })
}

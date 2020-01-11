import { useEffect } from 'react'

export const useKeyboardEvent = (keys, callback) => {
    useEffect(() => {
        const downHandler = function(event) {
            if (keys.includes(event.key)) {
                callback(true, event.key)
            }
        }
        const upHandler = function(event) {
            if (keys.includes(event.key)) {
                callback(false, event.key)
            }
        }
        window.addEventListener('keydown', downHandler)
        window.addEventListener('keyup', upHandler)
        return () => {
            window.removeEventListener('keydown', downHandler)
            window.removeEventListener('keyup', upHandler)
        }
    })
}

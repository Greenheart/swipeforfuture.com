import type { GameWorld } from './ContentTypes'

async function tryLoadFromLocalStorage(
    path: string,
): Promise<GameWorld | null> {
    const matchLocal = path.match(/^local:\/\/(.*)/)

    if (matchLocal) {
        // Import from SFF game world editor hosted on the same domain.
        // Using localStorage to share data across apps
        const id = matchLocal[1]
        const gameWorldId = 'game_world:' + id
        const gameWorld: GameWorld = {
            stats: [],
            cards: [],
            defaultState: {
                state: {},
                flags: {},
            },
            worldStateModifiers: [],
        }
        const serializedData = localStorage.getItem(gameWorldId)
        const data: GameWorld = serializedData
            ? JSON.parse(serializedData)
            : null
        if (!data)
            throw new Error(
                'Could not load data from local storage: ' + gameWorldId,
            )
        return Object.assign(gameWorld, data)
    }

    return null
}

export async function loadScenario(path: string): Promise<GameWorld | null> {
    return (
        (await tryLoadFromLocalStorage(path)) ||
        (await fetchJSON<GameWorld | null>(path))
    )
}

async function fetchJSON<T>(path: string): Promise<T> {
    console.log('fetching path: ', path)
    return await (await window.fetch(path)).json()
}

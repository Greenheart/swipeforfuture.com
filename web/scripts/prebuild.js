import { remove } from 'fs-extra'
import { resolve } from 'path'

/**
 * Don't deploy development versions of scenarios together with the game client.
 */
await remove(resolve('./static/dev-only'))

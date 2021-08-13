import { rm } from 'fs/promises'
import { resolve } from 'path'

/**
 * Don't deploy development versions of scenarios together with the game client.
 */
await rm(resolve('./static/dev-only'), { recursive: true, force: true })

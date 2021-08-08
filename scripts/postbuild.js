import { createFile } from 'fs-extra'
import { resolve } from 'path'

/**
 * Create `.nojekyll` file to force GitHub pages to accept this as a fully static webpage.
 */
await createFile(resolve(process.cwd(), 'build', '.nojekyll'))
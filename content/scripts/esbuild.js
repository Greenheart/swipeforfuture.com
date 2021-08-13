import { execFile } from 'child_process'
import esbuild from 'esbuild'
import { emptyDir } from 'fs-extra'
import _glob from 'glob'
import { resolve } from 'path'
import { promisify } from 'util'

const glob = promisify(_glob)
const outdir = './compiled'
const compiledDir = resolve(outdir)

await emptyDir(compiledDir)

const args = process.argv.slice(2)
const mode = args.includes('--watch') ? 'watch' : 'build'
const ids = args.filter((item) => item !== '--watch')

const scenarioPaths = await glob('./scenarios/**/*.ts')

/**
 * Export JSON files for selected scenarios.
 *
 * @param {string} mode Either `watch` for development or `build` for production build.
 * @param {string[]} ids Scenario ids to build.
 */
function exportScenarios(mode, ids) {
    execFile(
        'node',
        [
            '--experimental-specifier-resolution=node',
            'compiled/content/scripts/build-scenarios.js',
            mode,
            ...ids,
        ],
        (error, stdout, stderr) => {
            if (error) console.error(error)
            else if (stdout) console.log(stdout)
            else if (stderr) console.log(stderr)
        },
    )
}

esbuild
    .build({
        entryPoints: [
            ...scenarioPaths,
            ...(await glob('./content-utils/*.ts')),
            './scripts/build-scenarios.ts',
            '../shared/ContentTypes.ts',
        ],
        outdir,
        bundle: false,
        sourcemap: false,
        minify: false,
        splitting: false,
        format: 'esm',
        target: ['esnext'],
        platform: 'node',
        watch:
            mode === 'watch'
                ? {
                      onRebuild(error) {
                          if (error) console.error('watch build failed:', error)
                          else {
                              // Rebuild Scenarios when changes are detected
                              exportScenarios(mode, ids)
                          }
                      },
                  }
                : undefined,
    })
    .then(() => exportScenarios(mode, ids))
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })

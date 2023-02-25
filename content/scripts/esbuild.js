import { execFile } from 'child_process'
import esbuild from 'esbuild'
import { emptyDir } from 'fs-extra'
import glob from 'fast-glob'
import { resolve } from 'path'

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

// @ts-expect-error Unknown error type
const stopOnError = (e) => {
    console.log(e)
    process.exit(1)
}

// @ts-expect-error
const buildContent = ({ errors, warnings }) => {
    if (errors) {
        for (const error of errors) {
            console.error('watch build failed:', error)
        }
    }
    if (warnings) {
        for (const warning of warnings) {
            console.log('watch build failed:', warning)
        }
    }
    exportScenarios(mode, ids)
}

const triggerBuild = () => context.rebuild().then(buildContent)

const context = await esbuild.context({
    entryPoints: [
        ...scenarioPaths,
        ...(await glob('./content-utils/*.ts')),
        './scripts/build-scenarios.ts',
        '../shared/ContentTypes.ts',
    ],
    plugins:
        mode === 'watch'
            ? [
                  {
                      name: 'rebuildContent',
                      setup: (build) => {
                          build.onEnd(buildContent)
                      },
                  },
              ]
            : undefined,
    outdir,
    bundle: false,
    sourcemap: false,
    minify: false,
    splitting: false,
    format: 'esm',
    target: ['esnext'],
    platform: 'node',
})

if (mode === 'watch') {
    console.log('start watching')
    await context.watch()
} else {
    await triggerBuild()
    await context.dispose()
}

import { outputFile } from 'fs-extra'
import { resolve } from 'path'

import scenarios from '../scenarios'
import type { Scenario, ScenarioManifest } from '../content-utils'

async function buildScenarioManifest(
    scenarios: { [id: string]: Scenario },
    outputDir: string,
    minify: boolean,
) {
    const manifest: ScenarioManifest = {
        buildDate: new Date().toISOString(),
        scenarios: Object.fromEntries(
            Object.keys(scenarios).map((id) => [id, {}]),
        ),
    }

    return outputFile(
        resolve(outputDir, 'scenarios.json'),
        JSON.stringify(manifest, null, minify ? 0 : 2),
    )
}

export async function buildScenarios(
    ids: string[],
    outputDir: string,
    minify: boolean,
) {
    return Promise.all(
        Object.values(scenarios)
            .filter((scenario) => ids.includes(scenario.id))
            .map(async (scenario) => {
                const outputPath = resolve(outputDir, `${scenario.id}.json`)
                await outputFile(
                    outputPath,
                    JSON.stringify(scenario, null, minify ? 0 : 2),
                )

                console.log(`✅ Built "${scenario.id}"   -->   ${outputPath}`)
            }),
    )
}

const [mode, ...args] = process.argv.slice(2)
const ids = args.length > 2 ? args : Object.keys(scenarios)
// IDEA: Maybe always build to the same folder to simplify?
const outputDir = resolve(
    mode === 'build' ? '../web/static/scenarios' : '../web/static/dev-only',
)

console.log('Building:', ids)

Promise.all([
    buildScenarios(ids, outputDir, mode === 'build'),
    buildScenarioManifest(scenarios, outputDir, mode === 'build'),
]).catch((reason: string) => {
    console.error('❌ Build error: ', reason)
})

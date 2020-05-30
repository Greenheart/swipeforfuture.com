// Build a scenario with given ID from CLI args

// Usage: `yarn scenario [ID]`
// ID = name of scenario script OR 'default' if no ID provided

import { join } from 'path'
import { promises } from 'fs'
const { writeFile, mkdir } = promises

import { ScenarioBuilder, Scenario } from './content-utils'
import { GameWorld } from '../src/game/ContentTypes'

const id = process.argv.length >= 3 ? process.argv[2] : 'default'

async function buildScenario(id: string) {
    try {
        const builder: ScenarioBuilder = (
            await import(`./scenarios/${id}/index.ts`)
        ).builder

        const scenario = builder.run()

        console.log(JSON.stringify(scenario, null, 2))
        console.log(`✅ Sucessfully built scenario "${id}"`)

        return scenario
    } catch (e) {
        throw new Error(`Error: Failed to build scenario "${id}" - ${e}`)
    }
}

async function exportScenario(id: string, scenario: Scenario) {
    // TODO: export scenario to JSON
    // Build into separate files and store in a output directory.
    // Create files in a directory, or write to existing if they already have been created.

    type Parts = {
        [K in keyof GameWorld]: string
    }

    const scenarioParts: Parts = {
        cards: 'cards',
        eventCards: 'event-cards',
        events: 'events',
        defaultState: 'default-state',
        stats: 'stats',
    }

    const outputDir = join(__dirname, '..', 'public', 'data', 'scenarios', id)

    // Create the necessary directories if they are missing
    await mkdir(outputDir, { recursive: true })

    await Promise.all(
        Object.entries(scenarioParts).map(([part, fileName]) =>
            writeFile(
                join(outputDir, `${fileName}.json`),
                JSON.stringify(scenario[part as keyof GameWorld], null, 4),
            ),
        ),
    )

    // TODO: improve the export, verify that it works correcly by diffing JSON output with default scenario
    // TODO: Export directly to the /src/public/scenarios directory to make it playable in game
    // TODO: Test export in the game and see if it's playable
    // TODO: simplify prop references to make output cleaner, since data might be edited manually in other editors - and that the generated prop references will change on every build.

    // IDEA: Add support for building all images used and saving them to a directory
    // save with format `pexels-[ID].png` or `unsplash-[ID].png`

    console.log(`✅ Sucessfully exported scenario "${id}"`)
}

buildScenario(id).then((scenario: Scenario) => {
    exportScenario(id, scenario)
})

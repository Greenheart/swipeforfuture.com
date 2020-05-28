// Build a scenario with given ID from CLI args

// Usage: `yarn scenario [ID]`
// ID = name of scenario script OR 'default' if no ID provided

import { ScenarioBuilder } from './content-utils'

const id = process.argv.length >= 3 ? process.argv[2] : 'default'

async function buildScenario(id: string) {
    try {
        const builder: ScenarioBuilder = (
            await import(`./scenarios/${id}/index.ts`)
        ).builder

        const scenario = builder.run()

        console.log(scenario)
        console.log(`"${id}" scenario was built!`)
    } catch (e) {
        console.error(`Error: Failed to build scenario ${id}`, e)
    }
}

buildScenario(id)

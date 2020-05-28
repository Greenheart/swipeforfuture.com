// Build a scenario with given ID from CLI args

// Usage: `yarn scenario [ID]`
// ID = name of scenario script OR 'default' if no ID provided

import { Scenario, ScenarioBuilder } from './content-utils'

const id = process.argv.length >= 3 ? process.argv[2] : 'default'

async function exportScenario(id: string) {
    const builder: ScenarioBuilder = await import(`./scenarios/${id}.ts`)
    const scenario: Scenario = builder.run()

    console.log(scenario)
    console.log(`"${id}" scenario was built!`)
}

exportScenario(id)

// Build a scenario with given ID from CLI args

// Usage: `yarn scenario [ID]`
// ID = name of scenario script OR 'default' if no ID provided

const id = process.argv.length >= 3 ? process.argv[2] : 'default'

// HACK: export this internal interface to count this as an ES module, which is required to run this
export interface Scenario {
    run: () => void
}

// TODO: Add support for top level await by using the next version of es modules in tsconfig.json
// This had to be changed to support ES modules in node scripts
// but there must be some way to get both ES modules + top level await

import(`./scenarios/${id}.ts`).then((scenario: Scenario) => {
    const gameWorld = scenario.run()
    console.log(gameWorld)
    console.log(`"${id}" scenario was built!`)
})

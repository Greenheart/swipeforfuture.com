import defaultScenario from './default/index.js'
// import coalMining from "./coal-mining-xlsx"

import type { Scenario } from '../content-utils/index.js'
const allScenarios = [
    defaultScenario,
    // coalMining,
]

const scenarios: Record<string, Scenario> = allScenarios.reduce(
    (prev: Record<string, Scenario>, scenario) => {
        prev[scenario.id] = scenario
        return prev
    },
    {},
)

export default scenarios

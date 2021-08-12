import defaultScenario from './default'

import type { Scenario } from '$content-utils'
const allScenarios = [defaultScenario]

const scenarios: Record<string, Scenario> = allScenarios.reduce(
    (prev: Record<string, Scenario>, scenario) => {
        prev[scenario.id] = scenario
        return prev
    },
    {},
)

export default scenarios

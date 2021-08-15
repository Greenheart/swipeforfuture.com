import fs from "fs"
import {
    parseScenario,
} from "../content-utils/parser"

const scenario = parseScenario(
    fs.readFileSync(
        "./data/scenario-1-test.xlsx",
        "binary"
    ),
    "coal-mining"
)

export default scenario
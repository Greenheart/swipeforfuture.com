import { propRef } from '../../content-utils'

/**
 * Global vars used by multiple parts of the scenario.
 *
 * When creating content, try adding local flags used in a single file to begin with.
 * Only add to these global vars when using multiple files.
 */
const VARS = {
    SOLAR_INVESTMENTS: propRef('solar-investments'),
    ROADS_SUGGESTED: propRef('roads-suggested'),
    ROAD_EXPANSION: propRef('road-expansion'),
    LUNCH_MEETING_COMPLETED: propRef('lunch-meeting-completed'),
    ENVIRA_INIT: propRef('envira-init'),
    INFRAN_INIT: propRef('infran-init'),
    BROWN_COAL_PLANT: propRef('brown-coal-plant'),
}

export default VARS

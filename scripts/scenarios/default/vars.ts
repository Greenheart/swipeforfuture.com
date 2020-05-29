import { propRef } from '../../content-utils'

/**
 * Global vars used by multiple parts of the scenario.
 *
 * When creating content, try adding local flags used in a single file to begin with.
 * Only add to these global vars when using multiple files.
 */
export const VARS = {
    BROWN_COAL_PLANTS: propRef('brown-coal-plant'),
    SOLAR_INVESTMENTS: propRef('solar-investments'),
    ROADS_SUGGESTED: propRef('roads-suggested'),
    ROAD_EXPANSION: propRef('road-expansion'),
}

import { propRef } from '../../content-utils'

/**
 * Global flags used by multiple parts of the scenario.
 *
 * When creating content, try adding local flags used in a single file to begin with.
 * Only add to these global flags when using multiple files.
 */
export const FLAGS = {
    LUNCH_MEETING_COMPLETED: propRef('needs-init'),
}

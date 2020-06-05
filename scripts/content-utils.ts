// GOAL: composable functions to generate content based on ContentTypes + variable input
// GOAL: export JSON
// GOAL: Save game world scenario to specific folder

/*
    IDEA: User stories

    As a card developer I would like to:
    - Create convenience function for creating a card that only should trigger once (using a unique flag)
*/

import {
    CardData,
    EventCard,
    GameWorld,
    StatDefinition,
    CardActionData,
    WorldQuery,
    EventCardActionData,
    WorldEvent,
    EventCardId,
} from '../src/game/ContentTypes'

/**
 * This type defines the shape of Scenarios created with this Content API
 */
export type Scenario = {
    id: string
} & GameWorld

/**
 * This interface defines how Scenarios are executed and built
 */
export interface ScenarioBuilder {
    run: () => Scenario
}

/**
 * Create a card template to be use to construct additional cards
 * Templates are used to create partial cards
 *
 * @param cardData The must have data for a template card
 * @param extras Optional additional data that is seldom reused from a template
 */
export function createCardTemplate(
    cardData: Pick<CardData, 'image' | 'location' | 'weight'>,
    extras: Partial<Pick<CardData, 'title' | 'text'>> = {},
): CardData {
    return {
        type: 'card',
        ...cardData,
        ...{
            title: '',
            text: '',
            ...extras,
        },
        isAvailableWhen: [],
        actions: {
            left: { modifier: {} },
            right: { modifier: {} },
        },
    }
}

/**
 * Create an event card based on a template, to avoid repetition
 *
 * @param template The card template to extend
 * @param override Fields to override
 */
export function createEventCardFromTemplate(
    { image, title, text, location, weight }: CardData,
    override: Partial<EventCard>,
): EventCard {
    const eventCard: EventCard = {
        image,
        title,
        text,
        location,
        weight,
        type: 'event',
        actions: {
            left: {
                ...addAction({}),
                nextEventCardId: null,
            },
            right: {
                ...addAction({}),
                nextEventCardId: null,
            },
        },
    }

    return {
        ...eventCard,
        ...override,
    }
}

/**
 * Create a card based on a template, to avoid repetition
 *
 * @param template The card template to extend
 * @param override Fields to override
 */
export function createCardFromTemplate(
    template: CardData,
    override: Partial<CardData>,
): CardData {
    return {
        ...template,
        ...override,
    }
}

/**
 * Get the unsplash image URL for a given id
 *
 * @param id The unsplash image id
 */
export function unsplashImage(id: string): string {
    return `https://images.unsplash.com/photo-${id}?fit=crop&w=800&q=60`
}

/**
 * Get the Pexels image URL for a given id
 *
 * @param id The pexels image id
 */
export function pexelsImage(id: string): string {
    return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300`
}

// Credit: https://gist.github.com/mathewbyrne/1280286
function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Create a WorldQuery.
 *
 * WorldQueries are used to define when cards should be available, or when events should trigger.
 *
 * @param state A set of WorldStateRanges that need to exist when this query should match
 * @param flags A set of flags that need to exist when this query should match
 */
export function worldQuery(
    state: WorldQuery['state'] = {},
    flags: WorldQuery['flags'] = {},
): WorldQuery {
    return {
        state,
        flags,
    }
}

/**
 * Easily create an action with the set modifier
 *
 * Actions are used to modify the game state and flags
 *
 * @param state The state to modify
 * @param flags The flags to modify
 */
export const setAction = action('set')

/**
 * Easily create an action with the add modifier
 *
 * Actions are used to modify the game state and flags
 *
 * @param state The state to modify
 * @param flags The flags to modify
 */
export const addAction = action('add')

/**
 * Easily create an action with the replace modifier
 *
 * Actions are used to modify the game state and flags
 *
 * @param state The state to modify
 * @param flags The flags to modify
 */
export const replaceAction = action('replace')

/**
 * Create an action factory
 *
 * @param type The modifier type to use
 */
export function action(
    type: CardActionData['modifier']['type'],
): (
    state?: CardActionData['modifier']['state'],
    flags?: CardActionData['modifier']['flags'],
) => CardActionData {
    return (state = {}, flags = {}) => {
        return {
            modifier: {
                type,
                state,
                flags,
            },
        }
    }
}

/**
 * Create an EventCard action to modify the state & flags and possibly point to another EventCard.
 *
 * @param action The action to trigger upon swipe.
 * @param eventCardId The next EventCard to trigger, or null to stop the event.
 */
export function eventCardAction(
    action: CardActionData,
    eventCardId: EventCardActionData['nextEventCardId'] = null,
): EventCardActionData {
    return {
        ...action,
        nextEventCardId: eventCardId,
    }
}

/**
 * Generate a unique cardRef to identify cards
 *
 * @param debugHint A string to identify the cardRef and help debugging
 */
export const cardRef: (debugHint: string) => string = createRefFactory('card')

/**
 * Generate a unique propRef to identify properties
 *
 * @param debugHint A string to identify the propRef and help debugging
 */
export const propRef: (debugHint: string) => string = createRefFactory('prop')

/**
 * Generate a reference factory in order to use separate reference contexts
 *
 * @param type A string to identify the type of reference to create
 */
function createRefFactory(type: string) {
    const typeSlug = slugify(type)
    let ticker = 0

    return (debugHint: string) => {
        const prefix = slugify(debugHint)
        return `${prefix}:${typeSlug}:${ticker++}`
    }
}

/**
 * Create a reusable StatDefinition. This is useful to acoid hard coded strings.
 *
 * @param name Display name to show represent the stat in UI and text
 * @param icon Icon code to use. Represents an icon component name from `react-icons`
 * @param iconSize A CSS size unit to change icon size
 */
export function stat(
    name: string,
    icon: string,
    iconSize?: string,
): StatDefinition {
    return {
        id: slugify(name),
        name,
        icon,
        iconSize,
    }
}
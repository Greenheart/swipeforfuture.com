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
} from "./index"

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
    cardData: Pick<CardData, "image" | "location" | "weight">,
    extras: Partial<Pick<CardData, "title" | "text">> = {},
): CardData {
    return {
        type: "card",
        ...cardData,
        ...{
            title: "",
            text: "",
            ...extras,
        },
        isAvailableWhen: [],
        actions: {
            left: { modifiers: [{}] },
            right: { modifiers: [{}] },
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
        type: "event",
        actions: {
            left: {
                ...action(addModifier()),
                nextEventCardId: null,
            },
            right: {
                ...action(addModifier()),
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
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, "") // Trim - from end of text
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
    state: WorldQuery["state"] = {},
    flags: WorldQuery["flags"] = {},
): WorldQuery {
    return {
        state,
        flags,
    }
}

export type Modifier = CardActionData["modifiers"][number]

/**
 * Create a swipeAction by combining a description with one or more modifiers.
 *
 * @param description A short text to explain one of the alternatives in a swipe decision.
 * @param modifiers One or more modifiers that should be applied when the player choose this course of action.
 */
export function action(
    modifiers: Modifier | Modifier[],
    description?: string,
): CardActionData {
    return {
        description,
        modifiers: Array.isArray(modifiers) ? modifiers : [modifiers],
    }
}

/**
 * Easily create a `set` modifier, to be used within an action
 *
 * Modifiers update the game state and flags
 *
 * @param state The state to modify
 * @param flags The flags to modify
 */
export const setModifier = modifier("set")

/**
 * Easily create an `add` modifier, to be used within an action
 *
 * Modifiers update the game state and flags
 *
 * @param state The state to modify
 * @param flags The flags to modify
 */
export const addModifier = modifier("add")

/**
 * Easily create a `replace` modifier, to be used within an action
 *
 * Modifiers update the game state and flags
 *
 * @param state The state to modify
 * @param flags The flags to modify
 */
export const replaceModifier = modifier("replace")

/**
 * Create an modifier factory
 *
 * @param type The modifier type to use
 */
export function modifier(
    type: Modifier["type"],
): (state?: Modifier["state"], flags?: Modifier["flags"]) => Modifier {
    return (state = {}, flags = {}) => {
        return {
            type,
            state,
            flags,
        }
    }
}

/**
 * Create an EventCard action to modify the state & flags and possibly point to another EventCard.
 *
 * @param action The action is either a state modifier or a string for description.
 *               An empty state modifier will be used for a string description.
 * @param eventCardId The next EventCard to trigger, or null to stop the event.
 */
export function eventCardAction(
    actionOrDescription: CardActionData | string,
    eventCardId: EventCardActionData["nextEventCardId"] = null,
): EventCardActionData {
    const actualAction =
        typeof actionOrDescription === "string"
            ? action(addModifier(), actionOrDescription)
            : actionOrDescription
    return {
        ...actualAction,
        nextEventCardId: eventCardId,
    }
}

/**
 * Generate a unique cardRef to identify cards
 *
 * @param debugHint A string to identify the cardRef and help debugging
 */
export const cardRef: (debugHint: string) => string = createRefFactory("card")

/**
 * Generate a unique propRef to identify properties
 *
 * @param debugHint A string to identify the propRef and help debugging
 */
export const propRef: (debugHint: string) => string = createRefFactory("prop")

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

export function createIdContext(namespace?: string) {
    let index = 0
    const map = new Map<unknown, string>()
    return (obj: unknown) => {
        const id =
            map.get(obj) ||
            [namespace, index++].filter((v) => v !== undefined).join(":")
        map.set(obj, id)
        return id
    }
}

import { CardData, EventCard, WorldQuery, addModifier, action } from "."
import {
    EventCardActionData,
    GameWorldModifier,
} from "../../game/ContentTypes"

export type BaseCard = Omit<CardData, "type" | "isAvailableWhen">

/**
 * Creates a complete card given only the artistic content
 *
 * @param image The image url to use for the card
 * @param title The title of the card
 * @param text The main text of the card
 * @param location The location where the card takes place
 * @param [left, right] Descriptions of left and right actions
 */
export function cardContent(
    image: string,
    title: string,
    text: string,
    location: string,
    [left, right]: [string, string],
): BaseCard {
    return {
        image: image,
        title: title,
        text: text,
        location: location,
        actions: {
            left: action(addModifier(), left),
            right: action(addModifier(), right),
        },
        weight: 1,
    }
}

/**
 * Given a generic card this creates a new card with updated logic content.
 *
 * @param card A card template that contains artistic content
 * @param isAvailableWhen The worldqueries for when the card is availables
 * @param [left, right] The left and right GameWorldModifiers
 * @param weight The weight of the card
 */
export function cardLogic(
    card: BaseCard,
    isAvailableWhen: WorldQuery[],
    [left, right]: [
        GameWorldModifier | GameWorldModifier[],
        GameWorldModifier | GameWorldModifier[],
    ],
    weight: number = 1,
): CardData {
    return {
        ...card,
        weight,
        isAvailableWhen,
        actions: {
            left: {
                description: card.actions.left.description,
                modifiers: Array.isArray(left) ? left : [left],
            },
            right: {
                description: card.actions.right.description,
                modifiers: Array.isArray(right) ? right : [right],
            },
        },
        type: "card",
    }
}

/**
 * Given a generic card this creates a new event card with updated logic content.
 *
 * @param card A card template that contains artistic content
 * @param [left, right] The left and right modifiers and nextEventCardId
 */
export function eventCardLogic(
    card: BaseCard,
    [
        [leftModifiers, leftNextEventCardId = null],
        [rightModifiers, rightNextEventCardId = null],
    ]: [
        [
            GameWorldModifier | GameWorldModifier[],
            EventCardActionData["nextEventCardId"]?,
        ],
        [
            GameWorldModifier | GameWorldModifier[],
            EventCardActionData["nextEventCardId"]?,
        ],
    ],
    weight: CardData["weight"] = 1,
): EventCard {
    return {
        ...card,
        weight,
        actions: {
            left: {
                modifiers: Array.isArray(leftModifiers)
                    ? leftModifiers
                    : [leftModifiers],
                nextEventCardId: leftNextEventCardId,
                description: card.actions.left.description,
            },
            right: {
                modifiers: Array.isArray(rightModifiers)
                    ? rightModifiers
                    : [rightModifiers],
                nextEventCardId: rightNextEventCardId,
                description: card.actions.right.description,
            },
        },
        type: "event",
    }
}

export function combineWorldQueries(...queries: WorldQuery[]): WorldQuery {
    return queries.reduce((acc, q) => ({
        state: {
            ...(acc.state ? acc.state : {}),
            ...(q.state ? q.state : {}),
        },
        flags: {
            ...(acc.flags ? acc.flags : {}),
            ...(q.flags ? q.flags : {}),
        },
    }))
}

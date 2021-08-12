import {
    CardPriority,
    GameWorldModifier,
    Card,
    WorldQuery,
    addModifier,
    action,
} from '.'

export type BaseCard = Omit<Card, 'isAvailableWhen' | 'priority'>

/**
 * Creates a complete card given only the artistic content
 *
 * @param id The id of the card, preferrably created using `cardRef()`
 * @param image The image url to use for the card
 * @param title The title of the card
 * @param text The main text of the card
 * @param location The location where the card takes place
 * @param [left, right] Descriptions of left and right actions
 */
export function cardContent(
    id: string,
    image: string,
    title: string,
    text: string,
    location: string,
    [left, right]: [string, string],
): BaseCard {
    return {
        id,
        image,
        title,
        text,
        location,
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
    priority: CardPriority = CardPriority.Card,
): Card {
    return {
        ...card,
        weight,
        isAvailableWhen,
        actions: {
            left: {
                description: card.actions.left.description,
                modifiers: Array.isArray(left) ? left : [left],
                next: card.actions.right.next,
            },
            right: {
                description: card.actions.right.description,
                modifiers: Array.isArray(right) ? right : [right],
                next: card.actions.right.next,
            },
        },
        priority,
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

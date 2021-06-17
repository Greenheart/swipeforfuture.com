import {
    CardData,
    BaseCard,
    WorldQuery,
    cardLogic,
    GameWorldModifier,
    combineWorldQueries,
} from "../content-utils"

type ModifierWithNextCard = GameWorldModifier & { next?: BaseCard }

export function createLinkContext(getId: (obj: unknown) => string) {
    function link(card: BaseCard): WorldQuery {
        const id = getId(card)
        return {
            flags: {
                [id]: true,
            },
        }
    }

    function linkTo(card: BaseCard): GameWorldModifier {
        const id = getId(card)
        return {
            type: "set",
            flags: {
                [id]: true,
            },
        }
    }

    function linkVisited(card: BaseCard): GameWorldModifier {
        const id = getId(card)
        return {
            type: "set",
            flags: {
                [id]: false,
            },
        }
    }

    function linkLogic(
        card: BaseCard,
        isAvailableWhen: WorldQuery[],
        [left, right]: [
            ModifierWithNextCard | ModifierWithNextCard[],
            ModifierWithNextCard | ModifierWithNextCard[],
        ],
        weight: number = 1,
        require: WorldQuery[] = [],
    ): CardData {
        return cardLogic(
            card,
            [
                ...(require.length === 0
                    ? isAvailableWhen
                    : isAvailableWhen
                          .map((q) =>
                              require.map((rq) => combineWorldQueries(q, rq)),
                          )
                          .flat()),
                ...(require.length === 0
                    ? [link(card)]
                    : require.map((rq) => combineWorldQueries(rq, link(card)))),
            ],
            [
                [
                    ...(Array.isArray(left) ? left : [left])
                        .map((wm) => [
                            {
                                ...wm,
                                next: undefined,
                            },
                            ...(wm.next ? [linkTo(wm.next)] : []),
                        ])
                        .flat(),
                    linkVisited(card),
                ],
                [
                    ...(Array.isArray(right) ? right : [right])
                        .map((wm) => [
                            {
                                ...wm,
                                next: undefined,
                            },
                            ...(wm.next ? [linkTo(wm.next)] : []),
                        ])
                        .flat(),
                    linkVisited(card),
                ],
            ],
            weight,
        )
    }

    function chainCards<T extends BaseCard>(endCard?: T) {
        return (card: T, index: number, cards: T[]) => {
            const next = cards[index + 1] || endCard
            return linkLogic(card, [], [{ next }, { next }])
        }
    }

    return {
        link,
        linkTo,
        linkVisited,
        linkLogic,
        chainCards,
    }
}

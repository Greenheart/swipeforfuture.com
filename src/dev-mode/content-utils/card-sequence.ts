import { GameWorldModifier } from "../../game/ContentTypes"
import {
    WorldQuery,
    CardData,
    cardRef,
    setModifier,
    CardTree,
    CardLeaf,
    cardsFromTree,
    isCardTree,
    combineWorldQueries,
} from "./"

/**
 * TODO:
 *
 * 1) ✅ Create CardSequence with support for linking cards
 * - ✅ fix bug to only show final card in sequence once
 * - (maybe) fix removing unused flags after they have been used to trigger cards in the sequence
 *
 * 2) ✅ Add support to execute different modifiers on left and right (implemented by CardTree)
 *
 * 3) ✅ Add support for CardTree within the CardSequenuce. If a node is a CardTree, then recursively call the cardsFromTree() function to build that subtree.
 * 4) Add support for CardSequence within the CardTree. If a node is a CardSequence, then then recursively call the cardsFromSequence() function to build that subsequence.
 *
 * 5) Add support for combining multiple CardSequences within a CardSequence
 */

export interface CardSequence {
    sequence: (CardTree | CardSequence)[]
}

export function isCardSequence(
    node: CardSequence | CardTree | CardLeaf,
): node is CardSequence {
    return "sequence" in node
}

/**
 * @param sequence The CardSequence to turn into an array of cards
 *
 * NOTE: The following params should only be used internally by the content utils
 * to connect the CardTrees. Define content within your CardTrees.
 *
 * @param _startConditions Internal WorldQuery[] to control when to start showing this CardSequence.
 * @param _endModifiers Internal GameWorldModifier[] to apply when all nodes of this CardSequence has been completed.
 */
export function cardsFromSequence(
    { sequence }: CardSequence,
    _startConditions: WorldQuery[] = [],
    _endModifiers: GameWorldModifier[] = [],
): CardData[] {
    // Remove any empty sequences to not mess up sequenceRefs
    // Maybe we could protect against this by improving the type to check for a non-empty array or something
    sequence = sequence.filter((node) =>
        isCardSequence(node) ? !!node.sequence.length : true,
    )

    const sequenceRefs = sequence.map((node) => {
        if (isCardTree(node)) {
            return cardRef(node.card.title + " sequence")
        } else if (isCardSequence(node)) {
            if (isCardTree(node.sequence[0])) {
                return cardRef(node.sequence[0].card.title + " sequence")
            }
            // TODO: Add support for nesting CardSequences multiple levels.
            // This is probably not going to be a common use case
            // However, we might want to support this to allow combining and re-using subsections of Sequences
            // This would allow us to split large Sequences into smaller bits, and then combine them by nesting them within each other.
            throw Error(
                `⚠️ Nesting multiple levels of CardSequences directly within one another is not yet supported\n\n${JSON.stringify(
                    node,
                    null,
                    4,
                )}\n`,
            )
        } else {
            throw Error(
                `⚠️ Unknown node type in CardSequence: \n\n${JSON.stringify(
                    node,
                    null,
                    4,
                )}\n`,
            )
        }
    })

    const cards = sequence.flatMap((node, i) => {
        const prevRef = sequenceRefs[i - 1]
        const currentRef = sequenceRefs[i]

        const conditions = getStartConditions(prevRef, currentRef)
        const isAvailableWhen =
            i > 0
                ? conditions
                : conditions.flatMap((c) =>
                      _startConditions.map((sc) => combineWorldQueries(c, sc)),
                  )

        const endModifiers = [
            ...(i === sequence.length - 1 && _endModifiers?.length
                ? _endModifiers
                : []),
            ...getEndModifiers(currentRef),
        ]

        if (isCardSequence(node)) {
            return cardsFromSequence(node, isAvailableWhen, endModifiers)
        } else if (isCardTree(node)) {
            return cardsFromTree(node, isAvailableWhen, endModifiers)
        } else {
            throw Error(
                `⚠️ Unknown node type in CardSequence: \n\n${JSON.stringify(
                    node,
                    null,
                    4,
                )}\n`,
            )
        }
    })

    return cards
}

function getStartConditions(prevRef: string, currentRef: string) {
    return [
        {
            flags: {
                ...(prevRef ? { [prevRef]: true } : {}),
                ...(currentRef ? { [currentRef]: false } : {}),
            },
        },
    ]
}

function getEndModifiers(currentRef: string) {
    return [
        setModifier(
            {},
            {
                ...(currentRef ? { [currentRef]: true } : {}),
            },
        ),
    ]
}

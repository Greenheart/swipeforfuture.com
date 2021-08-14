export type ImageDBEntry = {
    id: string
    variant: number | string
    url: string
}

/**
 * Create and image database entry fron parameters
 *
 * @param id The selection id
 * @param url The image URL
 * @param variant The selection variant
 */
export function imageEntry(
    id: string,
    url: string,
    variant: number | string = 'default',
) {
    return {
        id,
        url,
        variant,
    }
}

/**
 * Create a simple image database in which to insert images based on id and variant.
 * The image search prioritizes matches on both id and variant but will return the
 * first id match when no variant matches.
 *
 * Will return default image when no matches are found.
 *
 * @param initialEntries
 * @param defaultImage
 */
export function imageDB(
    initialEntries: ImageDBEntry[] = [],
    defaultImage: string = '',
) {
    const entries: ImageDBEntry[] = [...initialEntries]
    return {
        add: (
            id: string,
            url: string,
            variant: number | string = 'default',
        ) => {
            entries.push({
                id,
                url,
                variant,
            })
        },
        image: (id: string, variant: number | string = 'default') => {
            const entriesWithId = entries.filter((entry) => entry.id === id)
            if (entriesWithId.length > 0) {
                const entryWithVariant = entriesWithId.find(
                    (entry) => entry.variant === variant,
                )
                if (!entryWithVariant)
                    console.warn('Variant not found: ', id, variant)
                return entryWithVariant
                    ? entryWithVariant.url
                    : entriesWithId[0].url
            }
            console.warn('Image not found: ', id, variant)
            return defaultImage
        },
    }
}

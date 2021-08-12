type ValueId<T> = {
    id: string
    value: T
}

export type DefaultState = ValueId<number>
export type DefaultFlag = ValueId<boolean>

export function defaultEntry<T>(id: string, value: T): ValueId<T> {
    return {
        id,
        value,
    }
}

export const defaultState: (id: string, value: number) => DefaultState =
    defaultEntry
export const defaultFlag: (id: string, value: boolean) => DefaultFlag =
    defaultEntry

export function combineDefaultEntries<T>(defaults: ValueId<T>[]): {
    [x: string]: T
} {
    return defaults.reduce(
        (acc, d) => ({
            ...acc,
            [d.id]: d.value,
        }),
        {},
    )
}

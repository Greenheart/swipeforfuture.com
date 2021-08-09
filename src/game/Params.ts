export type Params = {
    vars: {
        [id: string]: number
    }
    flags: {
        [id: string]: boolean
    }
}

export type ParamQuery = {
    vars?: {
        [id: string]: [number, number]
    }
    flags?: {
        [id: string]: boolean
    }
}

export function hasMatchingParamQuery(
    params: Params,
    worldQueries: ParamQuery[],
): boolean {
    return worldQueries.some((q) => isMatchingParamQuery(params, q))
}

export function isMatchingParamQuery(
    params: Params,
    { vars = {}, flags = {} }: ParamQuery,
): boolean {
    const hasStateMatch = Object.entries(vars).every(
        ([key, [min, max]]) =>
            params.vars[key] >= min && params.vars[key] <= max,
    )

    const result =
        hasStateMatch &&
        Object.entries(flags).every(
            ([flag, value]) => !!params.flags[flag] === value,
        )

    return result
}

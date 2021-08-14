export type Params = {
    vars: {
        [id: string]: number
    }
}

export type ParamQuery = {
    vars?: {
        [id: string]: [number, number]
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
    { vars = {} }: ParamQuery,
): boolean {
    const hasStateMatch = Object.entries(vars).every(
        ([key, [min, max]]) =>
            params.vars[key] >= min && params.vars[key] <= max,
    )

    return hasStateMatch
}

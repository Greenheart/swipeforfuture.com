export type Params = {
    vars: {
        [id: string]: number
    }
}

export type ParamQuery = {
    vars?: {
        [id: string]: [number, number] | number
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
        ([key, value]) => {
            if (Array.isArray(value)) {
                // Match if value is within the range
                const [min, max] = value
                return params.vars[key] >= min && params.vars[key] <= max
            } else {
                // Shorthand syntax used: Match if value is exact match
                return params.vars[key] === value
            }
        }
    )

    return hasStateMatch
}

import xlsx from "xlsx"

export type TypeMapping<T> = {
    [A in keyof T]: (value: unknown) => T[A]
}

export function loadFile<T>(
    data: any,
    fieldMapping: TypeMapping<T>,
    {
        sheetIds,
        sheetFilter,
    }: Partial<{
        sheetIds: string[],
        sheetFilter: (id: string) => boolean
    }> = {},
): (T & { __sheet?: string })[] {
    const book = xlsx.read(
        data,
        {
            type: 'binary'
        }
    )
    const finalFilter = sheetFilter || (() => true)
    const requiredFields: (keyof T)[] = Object.keys(fieldMapping) as (keyof T)[]
    const transformedSheets = Object.keys(book.Sheets).map<T[]>((key) => {
        if (
            (
                sheetIds !== undefined &&
                !sheetIds.includes(key)
            ) ||
            !finalFilter(key)
        ) return []

        const sheet = book.Sheets[key]
        const data = xlsx.utils.sheet_to_json<{ [A in keyof T]: unknown }>(
            sheet,
            {
                header: 0,
            },
        )
        return data.map((d) => ({
            __sheet: key,
            ...(requiredFields.reduce<Partial<T>>(
                (acc: Partial<T>, fieldId) => {
                    return {
                        ...acc,
                        [fieldId]: fieldMapping[fieldId](d[fieldId]),
                    }
                },
                {},
            ) as T),
        }))
    })
    return new Array<T>().concat(...transformedSheets)
}

export function toString<T>(base: T): (v: any) => string | T {
    return (value: any) => {
        return value === undefined ? base : value + ""
    }
}

export function toLowerCaseString<T>(base: T): (v: any) => string | T {
    return (val: any) => {
        const r = toString(undefined)(val)
        return r === undefined ? base : r.toLocaleLowerCase()
    }
}

export function toStringArray(
    split = ";",
    processValue: (val: any) => string = toString(""),
): (value: any) => string[] {
    return (value: any) => {
        const result = processValue(value)
        return result === "" ? [] : result.split(split).map((v) => v.trim())
    }
}

export function toNumber(value: any): number {
    return value ? parseFloat(value) : 0
}

export function toBoolean(value: any): boolean {
    const v = (
        typeof value === "boolean" ? (
            value
        ) : (
            value === "true" ? (
                true
            ) : (
                false
            )
        )
    )
    return v
}
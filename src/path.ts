export type Accessor<T> = (value: T) => any // TODO: Proper types?

export type Path = PathStep[]

export type PathStep = number | string

export function accessor<T>(path: Path | PathStep = []): Accessor<T> {
    const pathArray = Array.isArray(path) ? path : [path]

    return (value: T) => {
        const result = (pathArray as any[]).reduce(getProperty, value)

        return result === undefined ? null : result
    }
}

export function combine(first: Path, ...rest: Path[]): Path {
    return first.concat(...rest)
}

function getProperty<T, K extends keyof T>(value: T | undefined, name: K): T[K] | undefined {
    return value && value[name]
}

export type Accessor<T> = (value: T) => any // TODO: Proper types?

export type Path = PathStep[]

export type PathStep = number | string

export function accessor<T>(path?: Path | PathStep): Accessor<T> {
    if (path === undefined) {
        return identity
    }

    const pathArray = Array.isArray(path) ? path : [path]

    return (value: T) => (pathArray as any[]).reduce(getProperty, value)
}

export function combine(first: Path, ...rest: Path[]): Path {
    return first.concat(...rest)
}

function getProperty<T, K extends keyof T>(value: T | undefined, name: K): T[K] | undefined {
    return value && value[name]
}

function identity<T>(value: T): T {
    return value
}

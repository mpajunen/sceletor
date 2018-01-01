export type Accessor<T> = (value: T) => any // TODO: Proper types?

export type Path = PathStep[]

export type PathStep = string // TODO: Add array support / numeric steps?

export function accessor<T>(path?: Path | PathStep): Accessor<T> {
    if (path === undefined) {
        return identity
    }

    const pathArray = Array.isArray(path) ? path : [path]

    return (value: T) => pathArray.reduce(getProperty, value)
}

function getProperty<T, K extends keyof T>(value: T | undefined, name: K): T[K] | undefined {
    return value && value[name]
}

function identity<T>(value: T): T {
    return value
}

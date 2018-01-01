import { Accessor, accessor } from './path'
import { Compare, Logical, Selector } from './selector'

type Predicate<T> = (value: T) => boolean

export function predicate<T>(selector: Selector): Predicate<T> {
    const get = accessor(selector.path)

    switch (selector.kind) {
        case 'and':
        case 'or':
            return createLogical(get, selector)
        case 'equal':
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
            return createCompare(get, selector)
    }
}

function createCompare<T>(get: Accessor<T>, selector: Compare): Predicate<T> {
    switch (selector.kind) {
        case 'equal':
            return (value: T) => get(value) === selector.value
        case 'gt':
            return (value: T) => get(value) > selector.value
        case 'gte':
            return (value: T) => get(value) >= selector.value
        case 'lt':
            return (value: T) => get(value) < selector.value
        case 'lte':
            return (value: T) => get(value) <= selector.value
    }
}

function createLogical<T>(get: Accessor<T>, selector: Logical): Predicate<T> {
    const conditions = selector.conditions.map(predicate)

    return function select<U>(value: T) {
        const subValue: U = get(value)

        return selector.kind === 'and'
            ? conditions.reduce(
                (accumulated: boolean, current: Predicate<U>) => accumulated && current(subValue),
                true,
            )
            : conditions.reduce(
                (accumulated: boolean, current: Predicate<U>) => accumulated || current(subValue),
                false,
            )
    }
}

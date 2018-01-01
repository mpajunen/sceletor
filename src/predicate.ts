import { Accessor, accessor } from './path'
import { Collection, Compare, Logical, Selector } from './selector'

type Predicate<T> = (value: T) => boolean

export function predicate<T>(selector: Selector): Predicate<T> {
    const get = accessor(selector.path)

    switch (selector.kind) {
        case 'allOf':
        case 'anyOf':
            return createCollection(get, selector)
        case 'and':
        case 'or':
            return createLogical(get, selector)
        case 'equal':
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
        case 'neq':
            return createCompare(get, selector)
        case 'not': {
            const inner = predicate(selector.condition)

            return (value: T) => !inner(get(value))
        }
    }
}

function createCollection<T>(get: Accessor<T>, selector: Collection): Predicate<T> {
    const [start, callback] = createCollectionComponents(selector)

    return function select<U>(value: T) {
        const collectionValues: U[] = get(value) || []

        return collectionValues.reduce(callback, start)
    }
}

type CollectionComponents<T> = [boolean, (accumulated: boolean, current: T) => boolean]

function createCollectionComponents<T>(selector: Collection): CollectionComponents<T> {
    const inner: Predicate<T> = predicate(selector.condition)

    switch (selector.kind) {
        case 'allOf':
            return [true, (accumulated: boolean, current: T) => accumulated && inner(current)]
        case 'anyOf':
            return [false, (accumulated: boolean, current: T) => accumulated || inner(current)]
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
        case 'neq':
            return (value: T) => get(value) !== selector.value
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

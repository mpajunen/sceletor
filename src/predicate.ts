import { Compare, Condition, IncludedIn, Logical } from './condition'
import { Accessor, accessor } from './path'

type Predicate<T> = (value: T) => boolean

export function predicate<T>(condition: Condition): Predicate<T> {
    const get = accessor(condition.path)

    switch (condition.kind) {
        case 'always':
            return () => true
        case 'every':
        case 'some':
            return createLogical(get, condition)
        case 'equal':
        case 'gt':
        case 'gte':
        case 'includedIn':
        case 'lt':
        case 'lte':
        case 'neq':
            return createCompare(get, condition)
        case 'never':
            return () => false
        case 'not': {
            const inner = predicate(condition.item)

            return (value: T) => !inner(get(value))
        }
        case 'noValue':
            return (value: T) => [undefined, null].includes(get(value))
    }
}

function createCompare<T>(get: Accessor<T>, condition: Compare | IncludedIn): Predicate<T> {
    switch (condition.kind) {
        case 'equal':
            return (value: T) => get(value) === condition.value
        case 'gt':
            return (value: T) => get(value) > condition.value
        case 'gte':
            return (value: T) => get(value) >= condition.value
        case 'includedIn':
            return (value: T) => condition.values.includes(get(value))
        case 'lt':
            return (value: T) => get(value) < condition.value
        case 'lte':
            return (value: T) => get(value) <= condition.value
        case 'neq':
            return (value: T) => get(value) !== condition.value
    }
}

function createLogical<T>(get: Accessor<T>, condition: Logical): Predicate<T> {
    const conditions = condition.items.map(predicate)

    return function select<U>(value: T) {
        const subValue: U = get(value)

        return condition.kind === 'every'
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

import { always, CompareKind, Condition, never, Not } from './condition'
import { combine } from './path'

export function simplify(condition: Condition): Condition {
    return trySimplify(condition)
}

function trySimplify(condition: Condition): Condition {
    switch (condition.kind) {
        case 'allOf':
        case 'always':
        case 'and':
        case 'anyOf':
        case 'or':
        case 'equal':
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
        case 'neq':
        case 'never':
            return condition
        case 'not':
            return simplifyNot(condition)
    }
}

function simplifyNot(condition: Not): Condition {
    const item = condition.item

    switch (item.kind) {
        case 'allOf':
        case 'and':
        case 'anyOf':
        case 'or':
            return condition
        case 'always':
            return never
        case 'gt':
        case 'gte':
        case 'equal':
        case 'lt':
        case 'lte':
        case 'neq':
            return {
                kind: compareComplements[item.kind],
                path: combine(condition.path, item.path),
                value: item.value,
            }
        case 'never':
            return always
        case 'not':
            return {
                ...item.item,
                path: combine(condition.path, item.path, item.item.path),
            }
    }
}

const compareComplements: Record<CompareKind, CompareKind> = {
    equal: 'neq',
    gt: 'lte',
    gte: 'lt',
    lt: 'gte',
    lte: 'gt',
    neq: 'equal',
}

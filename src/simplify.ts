import { combine } from './path'
import { CompareKind, Not, not, Selector } from './selector'

export function simplify(selector: Selector): Selector {
    return trySimplify(selector)
}

function trySimplify(selector: Selector): Selector {
    switch (selector.kind) {
        case 'and':
        case 'or':
        case 'equal':
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
        case 'neq':
            return selector
        case 'not':
            return simplifyNot(selector)
    }
}

function simplifyNot(selector: Not): Selector {
    const inner = selector.condition

    switch (inner.kind) {
        case 'and':
        case 'or':
            return selector
        case 'gt':
        case 'gte':
        case 'equal':
        case 'lt':
        case 'lte':
        case 'neq':
            return {
                kind: compareComplements[inner.kind],
                path: combine(selector.path, inner.path),
                value: inner.value,
            }
        case 'not':
            return {
                ...inner.condition,
                path: combine(selector.path, inner.path, inner.condition.path),
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

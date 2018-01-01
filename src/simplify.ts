import { combine } from './path'
import { Compare, CompareKind, Not, not, Selector } from './selector'

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
            return selector
        case 'not':
            return simplifyNot(selector)
    }
}

function simplifyNot(selector: Not): Selector {
    const inner = selector.condition

    switch (inner.kind) {
        case 'and':
        case 'equal':
        case 'or':
            return selector
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
            return {
                ...complement(inner),
                path: combine(selector.path, inner.path),
            }
        case 'not':
            return {
                ...inner.condition,
                path: combine(selector.path, inner.path, inner.condition.path),
            }
    }
}

const compareComplements: Record<CompareKind, CompareKind> = {
    equal: 'equal', // Not really
    gt: 'lte',
    gte: 'lt',
    lt: 'gte',
    lte: 'gt',
}

function complement(selector: Compare): Selector {
    if (selector.kind === 'equal') {
        return not(selector)
    }

    return {
        ...selector,
        kind: compareComplements[selector.kind],
    }
}

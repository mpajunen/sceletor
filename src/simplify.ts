import { always, BaseKind, CompareKind, Condition, Logical, LogicalKind, never, not, Not } from './condition'
import { combine } from './path'

export function simplify(condition: Condition): Condition {
    return trySimplify(condition)
}

function trySimplify(condition: Condition): Condition {
    switch (condition.kind) {
        case 'allOf':
        case 'always':
        case 'anyOf':
        case 'equal':
        case 'gt':
        case 'gte':
        case 'includedIn':
        case 'lt':
        case 'lte':
        case 'neq':
        case 'never':
            return condition
        case 'every':
        case 'some':
            return simplifyLogical(condition)
        case 'not':
            return simplifyNot(condition)
    }
}

interface LogicalRule {
    unify: BaseKind
    drop: BaseKind
}

const logicalRules: Record<LogicalKind, LogicalRule> = {
    every: {
        unify: 'never',
        drop: 'always',
    },
    some: {
        unify: 'always',
        drop: 'never',
    },
}

function simplifyLogical(condition: Logical): Condition {
    const { unify, drop } = logicalRules[condition.kind]

    const items = condition.items.filter(i => i.kind !== drop)

    if (items.length === 0) {
        return {
            kind: drop,
            path: [],
        }
    } else if (items.find(i => i.kind === unify) !== undefined) {
        return {
            kind: unify,
            path: [],
        }
    } else if (items.length === 1) {
        const { path, ...item } = items[0]

        return {
            ...item,
            path: combine(condition.path, path),
        }
    } else {
        return {
            ...condition,
            items,
        }
    }
}

function simplifyNot(condition: Not): Condition {
    const item = condition.item

    switch (item.kind) {
        case 'allOf':
        case 'anyOf':
        case 'includedIn':
            return condition
        case 'every':
        case 'some':
            return {
                kind: item.kind === 'every' ? 'some' : 'every',
                items: item.items.map(i => simplify(not(i))),
                path: combine(condition.path, item.path),
            }
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

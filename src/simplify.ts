import { rules } from './compareRules'
import {
    always,
    BaseKind,
    Comparable,
    Compare,
    CompareKind,
    Condition,
    IncludedIn,
    Kind,
    Logical,
    LogicalKind,
    never,
    not,
    Not,
} from './condition'
import { combine, Path } from './path'

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
    }

    const combinedItems = combineList(condition.kind, items)

    if (combinedItems.length === 1) {
        const { path, ...item } = combinedItems[0]

        return {
            ...item,
            path: combine(condition.path, path),
        }
    } else {
        return {
            ...condition,
            items: combinedItems,
        }
    }
}

export function combineList(kind: LogicalKind, conditions: Condition[]): Condition[] {
    for (let i = 0; i < conditions.length; i += 1) {
        for (let j = i + 1; j < conditions.length; j += 1) {
            const combined = combineConditions(kind, conditions[i], conditions[j])

            if (combined) {
                // Try to recombine the shorter list immediately.
                // Might be better to just retry simplification from the the top again. (Or do something smarter.)
                return combineList(kind, [
                    ...conditions.slice(0, i),
                    combined,
                    ...conditions.slice(i + 1, j),
                    ...conditions.slice(j + 1),
                ])
            }
        }
    }

    return conditions
}

const compareKinds: CompareKind[] = ['equal', 'gt', 'gte', 'lt', 'lte', 'neq']

const isCompare = (condition: Condition): condition is Compare => (compareKinds as Kind[]).includes(condition.kind)

export function combineConditions(kind: LogicalKind, a: Condition, b: Condition): Condition | false {
    if (!pathEqual(a.path, b.path)) {
        return false
    }

    if (isCompare(a) && isCompare(b)) {
        return combineComparisons(kind, a, b)
    }

    if (a.kind === 'includedIn' && b.kind === 'includedIn') {
        return combineIncludes(kind, a, b)
    }

    if (a.kind === 'includedIn' && b.kind === 'not' && b.item.kind === 'includedIn') {
        return combineNegationInclude(kind, a, b.item)
    }
    if (b.kind === 'includedIn' && a.kind === 'not' && a.item.kind === 'includedIn') {
        return combineNegationInclude(kind, b, a.item)
    }

    return false
}

function combineComparisons(kind: LogicalKind, left: Compare, right: Compare): Condition | false {
    const valueCompare = compareValues(left.value, right.value)
    const rule = rules[kind][left.kind][right.kind][valueCompare]

    switch (rule) {
        case 'always':
            return always
        case 'never':
            return never
        case 'left':
            return left
        case 'right':
            return right
        case 'either':
            return left
        case 'both':
            return false
    }
}

function combineIncludes(kind: LogicalKind, left: IncludedIn, right: IncludedIn): Condition | false {
    const values = kind === 'every'
        ? left.values.filter(value => right.values.includes(value))
        : [...new Set([...left.values, ...right.values])]

    if (values.length === 0) {
        return never
    }

    return { ...left, values }
}

function combineNegationInclude(kind: LogicalKind, include: IncludedIn, exclude: IncludedIn): Condition | false {
    if (kind === 'every') {
        const values = include.values.filter(value => !exclude.values.includes(value))

        if (values.length === 0) {
            return never
        }

        return { ...include, values }
    } else {
        return include.values.some(value => exclude.values.includes(value)) ? always : false
    }
}

const pathEqual = (a: Path, b: Path): boolean =>
    a.length === b.length && a.every((step, index) => step === b[index])

const compareValues = (a: Comparable, b: Comparable): 0 | 1 | -1 =>
    a === b ? 0 : (a < b ? -1 : 1)

function simplifyNot(condition: Not): Condition {
    const item = condition.item

    switch (item.kind) {
        case 'allOf':
        case 'anyOf':
        case 'includedIn':
            return condition
        case 'every':
        case 'some':
            return simplifyLogical({
                kind: item.kind === 'every' ? 'some' : 'every',
                items: item.items.map(i => simplify(not(i))),
                path: combine(condition.path, item.path),
            })
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

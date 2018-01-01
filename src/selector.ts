import { Path, PathStep } from './path'

export type Kind =
    | CompareKind
    | LogicalKind
    | 'not'

export type Selector =
    | Compare
    | Logical
    | Not

export type Comparable =
    | boolean
    | number
    | string

export type CompareKind =
    | 'equal'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'

export interface Compare {
    kind: CompareKind
    path: Path
    value: Comparable
}

const compare = (kind: CompareKind) => (value: Comparable, path: Path | PathStep = []): Compare => ({
    kind,
    path: Array.isArray(path) ? path : [path],
    value,
})

export const equal = compare('equal')
export const gt = compare('gt')
export const gte = compare('gte')
export const lt = compare('lt')
export const lte = compare('lte')

export type LogicalKind =
    | 'and'
    | 'or'

export interface Logical {
    kind: LogicalKind
    path: Path
    conditions: Selector[]
}

const logical = (kind: LogicalKind) => (conditions: Selector[], path: Path | PathStep = []): Logical => ({
    kind,
    path: Array.isArray(path) ? path : [path],
    conditions,
})

export const and = logical('and')
export const or = logical('or')

export interface Not {
    kind: 'not'
    path: Path
    condition: Selector
}

export const not = (condition: Selector, path: Path | PathStep = []): Not => ({
    kind: 'not',
    path: Array.isArray(path) ? path : [path],
    condition,
})

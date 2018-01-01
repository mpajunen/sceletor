import { Path, PathStep } from './path'

export type Kind =
    | CollectionKind
    | CompareKind
    | LogicalKind
    | 'not'

export type Selector =
    | Collection
    | Compare
    | Logical
    | Not

export type CollectionKind =
    | 'allOf'
    | 'anyOf'

export interface Collection {
    kind: CollectionKind
    path: Path
    condition: Selector
}

const collection = (kind: CollectionKind) => (condition: Selector, path: Path | PathStep = []): Collection => ({
    kind,
    path: Array.isArray(path) ? path : [path],
    condition,
})

export const allOf = collection('allOf')
export const anyOf = collection('anyOf')

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
    | 'neq'

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
export const neq = compare('neq')

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

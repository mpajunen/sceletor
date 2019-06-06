import { Path, PathStep } from './path'

export type Kind =
    | BaseKind
    | CollectionKind
    | CompareKind
    | LogicalKind
    | 'not'

export type Condition =
    | Base
    | Collection
    | Compare
    | Logical
    | Not

export type BaseKind =
    | 'always'
    | 'never'

export interface Base {
    kind: BaseKind
    path: Path // Not used, but helpful for similarity with other conditions.
}

const base = (kind: BaseKind): Base => ({
    kind,
    path: [],
})

export const always = base('always')
export const never = base('never')

export type CollectionKind =
    | 'allOf'
    | 'anyOf'

export interface Collection {
    kind: CollectionKind
    path: Path
    item: Condition
}

const collection = (kind: CollectionKind) => (item: Condition, path: Path | PathStep = []): Collection => ({
    kind,
    path: Array.isArray(path) ? path : [path],
    item,
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
    items: Condition[]
}

const logical = (kind: LogicalKind) => (items: Condition[], path: Path | PathStep = []): Logical => ({
    kind,
    path: Array.isArray(path) ? path : [path],
    items,
})

export const and = logical('and')
export const or = logical('or')

export interface Not {
    kind: 'not'
    path: Path
    item: Condition
}

export const not = (item: Condition, path: Path | PathStep = []): Not => ({
    kind: 'not',
    path: Array.isArray(path) ? path : [path],
    item,
})
import { Path } from './path'

export type Kind =
    | CompareKind
    | LogicalKind

export type Selector =
    | Compare
    | Logical

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
    path?: Path
    value: Comparable
}

const compare = (kind: CompareKind) => (value: Comparable, path?: Path): Compare => ({
    kind,
    path,
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
    path?: Path
    conditions: Selector[]
}

const logical = (kind: LogicalKind) => (conditions: Selector[], path?: Path): Logical => ({
    kind,
    path,
    conditions,
})

export const and = logical('and')
export const or = logical('or')

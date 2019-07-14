// tslint:disable

import { Compare, CompareKind, Logical, LogicalKind } from '../condition'
import { predicate } from '../predicate'

type CompType = 'condLow1' | 'condLow2' | 'condHigh1' | 'condHigh2' | 'same' | 'lower' | 'higher'
type Row = { value: number } & Record<CompType, boolean | Result>

type Result = 'always' | 'never' | 'either' | 'both' | 'left' | 'right'

const TEST_VALUES = [1, 2, 3, 4, 5]
const TEST_LOW = 2
const TEST_HIGH = 4

const LOGICAL_KINDS: LogicalKind[] = ['every', 'some']
const COMPARE_KINDS: CompareKind[] = ['equal', 'neq', 'lt', 'gt', 'lte', 'gte']

const compare = (kind: CompareKind, value: number): Compare => ({ kind, value, path: [] })

const logical = (kind: LogicalKind, items: Compare[]): Logical => ({ kind, items, path: [] })

const getPredicates = (kindLogic: LogicalKind, kind1: CompareKind, kind2: CompareKind): [CompType, Function][] => {
    const low1 = compare(kind1, TEST_LOW)
    const low2 = compare(kind2, TEST_LOW)
    const high1 = compare(kind1, TEST_HIGH)
    const high2 = compare(kind2, TEST_HIGH)

    return [
        ['condLow1', predicate(low1)],
        ['condLow2', predicate(low2)],
        ['condHigh1', predicate(high1)],
        ['condHigh2', predicate(high2)],
        ['same', predicate(logical(kindLogic, [low1, low2]))],
        ['lower', predicate(logical(kindLogic, [low1, high2]))],
        ['higher', predicate(logical(kindLogic, [high1, low2]))],
    ]
}

const isSame = (rows: Partial<Row>[], a: CompType, b: CompType) =>
    rows.every(row => row[a] === row[b])

const getResult = (rows: Partial<Row>[], res: CompType, left: CompType, right: CompType): Result => {
    if (rows.every(row => row[res] === true)) {
        return 'always'
    }
    if (rows.every(row => row[res] === false)) {
        return 'never'
    }

    const matchLeft = isSame(rows, res, left)
    const matchRight = isSame(rows, res, right)

    return matchLeft ? (matchRight ? 'either' : 'left') : (matchRight ? 'right' : 'both')
}

const testCombination = (kindLogic: LogicalKind, kind1: CompareKind, kind2: CompareKind) => {
    const predicates = getPredicates(kindLogic, kind1, kind2)

    const rows: Partial<Row>[] = TEST_VALUES.map(value => {
        const row: Partial<Row> = {}

        row.value = value
        predicates.forEach(([comp, predicate]) => {
            row[comp] = predicate(value)
        })

        return row
    })

    return {
        kindLogic,
        kind1,
        kind2,
        same: getResult(rows, 'same', 'condLow1', 'condLow2'),
        lower: getResult(rows, 'lower', 'condLow1', 'condHigh2'),
        higher: getResult(rows, 'higher', 'condHigh1', 'condLow2'),
    }
}

const testCombinations = (kind1: CompareKind, kind2: CompareKind) => {
    const rows = []

    for (const kindLogic of LOGICAL_KINDS) {
        rows.push(testCombination(kindLogic, kind1, kind2))
        if (kind1 !== kind2) {
            rows.push(testCombination(kindLogic, kind2, kind1))
        }
    }

    return rows
}

const getRuleRows = () => {
    const rows = []

    for (let i = 0; i < COMPARE_KINDS.length; i += 1) {
        for (let j = i; j < COMPARE_KINDS.length; j += 1) {
            rows.push(...testCombinations(COMPARE_KINDS[i], COMPARE_KINDS[j]))
        }
    }

    return rows
}

type RuleRow = ReturnType<typeof testCombination>

const getSingleRuleString = (rule: RuleRow) => `{ '-1': '${rule.lower}', 0: '${rule.same}', 1: '${rule.higher}' }`

const getRuleString = (rules: RuleRow[]) =>`// tslint:disable

import { CompareKind, LogicalKind } from './condition'

type Result = 'always' | 'never' | 'either' | 'both' | 'left' | 'right'
type Rules = Record<LogicalKind, Record<CompareKind, Record<CompareKind, Record<0 | -1 | 1, Result>>>>

export const rules: Rules = {
${LOGICAL_KINDS.map(kindLogic =>
    `${kindLogic}: {
        ${COMPARE_KINDS.map(kind1 =>
            `${kind1}: {
                ${COMPARE_KINDS.map(kind2 =>
                    `${kind2}: ${getSingleRuleString(
                        rules.find(r => r.kindLogic === kindLogic && r.kind1 === kind1 && r.kind2 === kind2)!
                    )},`
                ).join('\n')}
            },`
        ).join('\n')}
    },`
).join('\n')}
}`

const generate = () => {
    const rows = getRuleRows()

    const rules = getRuleString(rows)

    console.log(rules)
}

generate()

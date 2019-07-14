// tslint:disable

import { CompareKind, LogicalKind } from './condition'

type Result = 'always' | 'never' | 'either' | 'both' | 'left' | 'right'
type Rules = Record<LogicalKind, Record<CompareKind, Record<CompareKind, Record<0 | -1 | 1, Result>>>>

export const rules: Rules = {
    every: {
        equal: {
            equal: { '-1': 'never', 0: 'either', 1: 'never' },
            neq: { '-1': 'left', 0: 'never', 1: 'left' },
            lt: { '-1': 'left', 0: 'never', 1: 'never' },
            gt: { '-1': 'never', 0: 'never', 1: 'left' },
            lte: { '-1': 'left', 0: 'left', 1: 'never' },
            gte: { '-1': 'never', 0: 'left', 1: 'left' },
        },
        neq: {
            equal: { '-1': 'right', 0: 'never', 1: 'right' },
            neq: { '-1': 'both', 0: 'either', 1: 'both' },
            lt: { '-1': 'both', 0: 'right', 1: 'right' },
            gt: { '-1': 'right', 0: 'right', 1: 'both' },
            lte: { '-1': 'both', 0: 'both', 1: 'right' },
            gte: { '-1': 'right', 0: 'both', 1: 'both' },
        },
        lt: {
            equal: { '-1': 'never', 0: 'never', 1: 'right' },
            neq: { '-1': 'left', 0: 'left', 1: 'both' },
            lt: { '-1': 'left', 0: 'either', 1: 'right' },
            gt: { '-1': 'never', 0: 'never', 1: 'both' },
            lte: { '-1': 'left', 0: 'left', 1: 'right' },
            gte: { '-1': 'never', 0: 'never', 1: 'both' },
        },
        gt: {
            equal: { '-1': 'right', 0: 'never', 1: 'never' },
            neq: { '-1': 'both', 0: 'left', 1: 'left' },
            lt: { '-1': 'both', 0: 'never', 1: 'never' },
            gt: { '-1': 'right', 0: 'either', 1: 'left' },
            lte: { '-1': 'both', 0: 'never', 1: 'never' },
            gte: { '-1': 'right', 0: 'left', 1: 'left' },
        },
        lte: {
            equal: { '-1': 'never', 0: 'right', 1: 'right' },
            neq: { '-1': 'left', 0: 'both', 1: 'both' },
            lt: { '-1': 'left', 0: 'right', 1: 'right' },
            gt: { '-1': 'never', 0: 'never', 1: 'both' },
            lte: { '-1': 'left', 0: 'either', 1: 'right' },
            gte: { '-1': 'never', 0: 'both', 1: 'both' },
        },
        gte: {
            equal: { '-1': 'right', 0: 'right', 1: 'never' },
            neq: { '-1': 'both', 0: 'both', 1: 'left' },
            lt: { '-1': 'both', 0: 'never', 1: 'never' },
            gt: { '-1': 'right', 0: 'right', 1: 'left' },
            lte: { '-1': 'both', 0: 'both', 1: 'never' },
            gte: { '-1': 'right', 0: 'either', 1: 'left' },
        },
    },
    some: {
        equal: {
            equal: { '-1': 'both', 0: 'either', 1: 'both' },
            neq: { '-1': 'right', 0: 'always', 1: 'right' },
            lt: { '-1': 'right', 0: 'both', 1: 'both' },
            gt: { '-1': 'both', 0: 'both', 1: 'right' },
            lte: { '-1': 'right', 0: 'right', 1: 'both' },
            gte: { '-1': 'both', 0: 'right', 1: 'right' },
        },
        neq: {
            equal: { '-1': 'left', 0: 'always', 1: 'left' },
            neq: { '-1': 'always', 0: 'either', 1: 'always' },
            lt: { '-1': 'always', 0: 'left', 1: 'left' },
            gt: { '-1': 'left', 0: 'left', 1: 'always' },
            lte: { '-1': 'always', 0: 'always', 1: 'left' },
            gte: { '-1': 'left', 0: 'always', 1: 'always' },
        },
        lt: {
            equal: { '-1': 'both', 0: 'both', 1: 'left' },
            neq: { '-1': 'right', 0: 'right', 1: 'always' },
            lt: { '-1': 'right', 0: 'either', 1: 'left' },
            gt: { '-1': 'both', 0: 'both', 1: 'always' },
            lte: { '-1': 'right', 0: 'right', 1: 'left' },
            gte: { '-1': 'both', 0: 'always', 1: 'always' },
        },
        gt: {
            equal: { '-1': 'left', 0: 'both', 1: 'both' },
            neq: { '-1': 'always', 0: 'right', 1: 'right' },
            lt: { '-1': 'always', 0: 'both', 1: 'both' },
            gt: { '-1': 'left', 0: 'either', 1: 'right' },
            lte: { '-1': 'always', 0: 'always', 1: 'both' },
            gte: { '-1': 'left', 0: 'right', 1: 'right' },
        },
        lte: {
            equal: { '-1': 'both', 0: 'left', 1: 'left' },
            neq: { '-1': 'right', 0: 'always', 1: 'always' },
            lt: { '-1': 'right', 0: 'left', 1: 'left' },
            gt: { '-1': 'both', 0: 'always', 1: 'always' },
            lte: { '-1': 'right', 0: 'either', 1: 'left' },
            gte: { '-1': 'both', 0: 'always', 1: 'always' },
        },
        gte: {
            equal: { '-1': 'left', 0: 'left', 1: 'both' },
            neq: { '-1': 'always', 0: 'always', 1: 'right' },
            lt: { '-1': 'always', 0: 'always', 1: 'both' },
            gt: { '-1': 'left', 0: 'left', 1: 'right' },
            lte: { '-1': 'always', 0: 'always', 1: 'both' },
            gte: { '-1': 'left', 0: 'either', 1: 'right' },
        },
    },
}

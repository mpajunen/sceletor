import test, { ExecutionContext } from 'ava'
import {
    allOf,
    always,
    Condition,
    equal,
    every,
    gt,
    gte,
    includedIn,
    lt,
    lte,
    neq,
    never,
    not,
    some,
} from '../condition'

const snap = (contents: Condition) =>
    function createSnap<T>(t: ExecutionContext<T>) {
        t.snapshot(contents)
    }

test('allOf creates collection conditions where every value must match', snap(
    allOf(equal(8)),
))

test('always is a condition that always matches', snap(
    always,
))

test('every combines conditions all of which must apply', snap(
    every([gt(5), lt(10)]),
))

test('every combines conditions of different properties', snap(
    every([equal(1, 'foo'), equal(2, 'bar')]),
))

test('every combines conditions with nested paths', snap(
    every([equal(3, 'foo'), gt(5, 'bar')], 'baz'),
))

test('anyOf creates conditions where at least one value must match', snap(
    allOf(equal(8)),
))

test('equal creates a sameness condition', snap(
    equal(1),
))

test('equal creates a property sameness condition', snap(
    equal(1, ['foo']),
))

test('gt creates a greater than comparison condition', snap(
    gt(50),
))

test('gte creates a greater than or equal comparison condition', snap(
    gte(50),
))

test('includedIn creates a condition where the value must match one of the options', snap(
    includedIn([1, 2, 3]),
))

test('lt creates a less than comparison condition', snap(
    lt(50),
))

test('lte creates a less than or equal comparison condition', snap(
    lte(50),
))

test('neq creates a non-sameness condition', snap(
    neq(1),
))

test('never is a condition that never matches', snap(
    never,
))

test('not creates a complement condition', snap(
    not(gt(30)),
))

test('some combines conditions at least one of which must apply', snap(
    some([lt(5), gt(10)]),
))

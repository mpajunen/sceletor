import test, { GenericTestContext } from 'ava'
import { allOf, always, and, Condition, equal, gt, gte, lt, lte, neq, never, not, or } from '../condition'

const snap = (contents: Condition) =>
    function createSnap<T>(t: GenericTestContext<T>) {
        t.snapshot(contents)
    }

test('allOf creates collection conditions where every value must match', snap(
    allOf(equal(8)),
))

test('always is a condition that always matches', snap(
    always,
))

test('and combines conditions all of which must apply', snap(
    and([gt(5), lt(10)]),
))

test('and combines conditions of different properties', snap(
    and([equal(1, 'foo'), equal(2, 'bar')]),
))

test('and combines conditions with nested paths', snap(
    and([equal(3, 'foo'), gt(5, 'bar')], 'baz'),
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

test('or combines conditions at least one of which must apply', snap(
    or([lt(5), gt(10)]),
))

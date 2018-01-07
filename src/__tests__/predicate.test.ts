import test from 'ava'
import { allOf, always, and, anyOf, equal, gt, gte, lt, lte, neq, never, not, or } from '../condition'
import { predicate } from '../predicate'

test('allOf creates conditions where every value must match', t => {
    const allEight = predicate(allOf(equal(8)))

    t.false(allEight([1, 2, 3]))
    t.false(allEight([1, 2, 8]))
    t.true(allEight([8, 8, 8]))
    t.true(allEight([8]))
})

test('allOf conditions match empty collections', t => {
    const allEight = predicate(allOf(equal(8)))

    t.true(allEight([]))
})

test('allOf conditions work with properties', t => {
    const everyFooBarEight = predicate(allOf(equal(8, 'bar'), 'foo'))

    t.false(everyFooBarEight({ foo: [{ bar: 1 }, { bar: 2 }, { bar: 9 }] }))
    t.false(everyFooBarEight({ foo: [{ bar: 1 }, { bar: 2 }, { bar: 8 }] }))
    t.true(everyFooBarEight({ foo: [{ bar: 8 }, { bar: 8 }, { bar: 8 }] }))
    t.false(everyFooBarEight({ foo: [{ bar: 1 }] }))
    t.true(everyFooBarEight({ foo: [{ bar: 8 }] }))
    t.true(everyFooBarEight({ baz: [{ bar: 8 }] }))
})

test('always is a condition that always matches', t => {
    const isTrue = predicate(always)

    t.true(isTrue(true))
    t.true(isTrue(false))
    t.true(isTrue('hello'))
    t.true(isTrue({ foo: 'bar' }))
})

test('and combines conditions all of which must apply', t => {
    const isBetweenFiveAndTen = predicate(
        and([gt(5), lt(10)]),
    )

    t.false(isBetweenFiveAndTen(2))
    t.true(isBetweenFiveAndTen(7))
    t.false(isBetweenFiveAndTen(15))
})

test('and combines conditions of different properties', t => {
    const isFooOneAndBarTwo = predicate(
        and([equal(1, 'foo'), equal(2, 'bar')]),
    )

    t.true(isFooOneAndBarTwo({ foo: 1, bar: 2 }))
    t.false(isFooOneAndBarTwo({ foo: 2, bar: 2 }))
    t.false(isFooOneAndBarTwo({ foo: 1, bar: 1 }))
    t.false(isFooOneAndBarTwo({}))
})

test('and combines conditions with nested paths', t => {
    const condition = predicate(
        and([equal(3, 'foo'), gt(5, 'bar')], 'baz'),
    )

    t.true(condition({ baz: { foo: 3, bar: 10 } }))
    t.false(condition({ baz: { foo: 2, bar: 10 } }))
    t.false(condition({ foo: 2, bar: 10 }))
})

test('anyOf creates conditions where at least one value must match', t => {
    const anyEight = predicate(anyOf(equal(8)))

    t.false(anyEight([1, 2, 3]))
    t.true(anyEight([1, 2, 8]))
    t.true(anyEight([8, 8, 8]))
    t.true(anyEight([8]))
})

test('anyOf conditions do not match empty collections', t => {
    const anyEight = predicate(anyOf(equal(8)))

    t.false(anyEight([]))
})

test('equal creates a sameness condition', t => {
    const isOne = predicate(equal(1))

    t.true(isOne(1))
    t.false(isOne(2))
    t.false(isOne('1'))
})

test('equal creates a property sameness condition', t => {
    const isFooOne = predicate(equal(1, ['foo']))

    t.true(isFooOne({ foo: 1 }))
    t.false(isFooOne({ foo: 2 }))
    t.false(isFooOne({ bar: 1 }))
    t.false(isFooOne(1))
})

test('gt creates a greater than comparison condition', t => {
    const isOverFifty = predicate(gt(50))

    t.false(isOverFifty(40))
    t.false(isOverFifty(50))
    t.true(isOverFifty(60))
})

test('gte creates a greater than or equal comparison condition', t => {
    const isFiftyOrOver = predicate(gte(50))

    t.false(isFiftyOrOver(40))
    t.true(isFiftyOrOver(50))
    t.true(isFiftyOrOver(60))
})

test('lt creates a less than comparison condition', t => {
    const isUnderFifty = predicate(lt(50))

    t.true(isUnderFifty(40))
    t.false(isUnderFifty(50))
    t.false(isUnderFifty(60))
})

test('lte creates a less than or equal comparison condition', t => {
    const isFiftyOrUnder = predicate(lte(50))

    t.true(isFiftyOrUnder(40))
    t.true(isFiftyOrUnder(50))
    t.false(isFiftyOrUnder(60))
})

test('neq creates a non-sameness condition', t => {
    const isNotOne = predicate(neq(1))

    t.false(isNotOne(1))
    t.true(isNotOne(2))
    t.true(isNotOne('1'))
})

test('never is a condition that never matches', t => {
    const isFalse = predicate(never)

    t.false(isFalse(true))
    t.false(isFalse(false))
    t.false(isFalse('hello'))
    t.false(isFalse({ foo: 'bar' }))
})

test('not creates a complement condition', t => {
    const isThirtyOrUnder = predicate(not(gt(30)))

    t.true(isThirtyOrUnder(20))
    t.true(isThirtyOrUnder(30))
    t.false(isThirtyOrUnder(40))
})

test('or combines conditions at least one of which must apply', t => {
    const isUnderFiveOrOverTen = predicate(or([lt(5), gt(10)]))

    t.true(isUnderFiveOrOverTen(2))
    t.false(isUnderFiveOrOverTen(7))
    t.true(isUnderFiveOrOverTen(15))
})

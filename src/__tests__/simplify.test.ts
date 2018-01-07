import test from 'ava'
import { always, and, equal, gt, gte, lt, lte, neq, never, not, or } from '../condition'
import { simplify } from '../simplify'

test('simplify returns the original condition for most kinds', t => {
    const fooOneAndBarTwo = and([equal(1, 'foo'), equal(2, 'bar')])
    const underFiveOrOverTen = or([lt(5), gt(10)])

    t.deepEqual(simplify(equal(8)), equal(8))
    t.deepEqual(simplify(gt(15)), gt(15))
    t.deepEqual(simplify(fooOneAndBarTwo), fooOneAndBarTwo)
    t.deepEqual(simplify(underFiveOrOverTen), underFiveOrOverTen)
})

test('simplify creates complements for negated base conditions', t => {
    t.deepEqual(simplify(not(always)), never)
    t.deepEqual(simplify(not(never)), always)
})

test('simplify creates complements for negated comparisons', t => {
    t.deepEqual(simplify(not(gt(16))), lte(16))
    t.deepEqual(simplify(not(gte(54))), lt(54))
    t.deepEqual(simplify(not(lt(125))), gte(125))
    t.deepEqual(simplify(not(lte(12))), gt(12))
    t.deepEqual(simplify(not(neq(34))), equal(34))
    t.deepEqual(simplify(not(equal(68))), neq(68))
})

test('simplify handles double negatives', t => {
    t.deepEqual(simplify(not(not(gte(54)))), gte(54))
})

test('simplify combines paths correctly', t => {
    const lesser = not(gte(16, 'foo'), 'bar')
    const negations = not(not(gte(54, 'baz'), ['bar', 'ugh']), 'foo')

    t.deepEqual(simplify(lesser), lt(16, ['bar', 'foo']))
    t.deepEqual(simplify(negations), gte(54, ['foo', 'bar', 'ugh', 'baz']))
})

test('simplify removes trivial logical conditions', t => {
    t.deepEqual(simplify(and([equal(8)])), equal(8))
    t.deepEqual(simplify(and([always])), always)
    t.deepEqual(simplify(and([never])), never)
    t.deepEqual(simplify(or([equal(8)])), equal(8))
    t.deepEqual(simplify(or([always])), always)
    t.deepEqual(simplify(or([never])), never)
})

test('simplify reduces nearly trivial logical conditions', t => {
    t.deepEqual(simplify(and([gt(5), lt(15), always])), and([gt(5), lt(15)]))
    t.deepEqual(simplify(and([gt(5), lt(15), never])), never)
    t.deepEqual(simplify(and([equal(8), always])), equal(8))
    t.deepEqual(simplify(or([gt(5), lt(15), always])), always)
    t.deepEqual(simplify(or([gt(5), lt(15), never])), or([gt(5), lt(15)]))
    t.deepEqual(simplify(or([equal(8), never])), equal(8))
})

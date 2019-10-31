import test from 'ava'
import { accessor } from '../path'

const blob = {
    baz: {
        bur: 'bob',
    },
    foo: 'bar',
}

test('accessor returns the original object with empty path', t => {
    const original = accessor()(blob)

    t.is(original.foo, 'bar')
})

test('accessor returns a property with string path', t => {
    const foo = accessor('foo')(blob)

    t.is(foo, 'bar')
})

test('accessor returns a property with array path', t => {
    const foo = accessor(['foo'])(blob)

    t.is(foo, 'bar')
})

test('accessor returns a nested property with array path', t => {
    const bur = accessor(['baz', 'bur'])(blob)

    t.is(bur, 'bob')
})

test('accessor returns null if path property is not found', t => {
    const ugh = accessor(['ugh'])(blob)

    t.is(ugh, null)
})

test('accessor returns null if nested path property is not found', t => {
    const bug = accessor(['ugh', 'bug'])(blob)

    t.is(bug, null)
})

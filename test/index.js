const assert = require('assert');
// const vm = require('vm');

const cm = require('../dist/cjs/index.min.js');

/**
 * tests combined from
 *
 * - https://github.com/lukeed/clsx/blob/master/test/index.js
 * - https://github.com/JedWatson/classnames/blob/main/tests/index.js
 * - https://github.com/alexnault/classix/blob/main/tests/index.test.ts
 * - https://github.com/jorgebucaran/classcat/blob/main/tests/index.test.js
 */

describe('compatibility tests', () => {
    it('emptys', () => {
        assert.strictEqual(cm(''), '');
        assert.strictEqual(cm(undefined), '');
        assert.strictEqual(cm(null), '');
        assert.strictEqual(cm(0), '');
    });

    it('strings', () => {
        assert.strictEqual(cm('foo'), 'foo');
        assert.strictEqual(cm('foo'), 'foo');
        assert.strictEqual(cm('foo', 'bar'), 'foo bar');
        assert.strictEqual(cm(true && 'foo'), 'foo');
        assert.strictEqual(cm(false && 'foo'), '');
        assert.strictEqual(cm(true ? 'foo' : 'bar'), 'foo');
        assert.strictEqual(cm(false ? 'foo' : 'bar'), 'bar');
    });

    it('numbers', () => {
        assert.strictEqual(cm(1), '1');
        assert.strictEqual(cm(12), '12');
        assert.strictEqual(cm(0.5), '0.5');
        assert.strictEqual(cm(1, 2), '1 2');
    });

    it('objects', () => {
        assert.strictEqual(cm({}), '');
        assert.strictEqual(cm({ foo: true }), 'foo');
        assert.strictEqual(cm({ foo: true, bar: false }), 'foo');
        assert.strictEqual(cm({ foo: true, bar: 1 }), 'foo bar');
        assert.strictEqual(cm({ foo: 1, bar: 0, baz: 1 }), 'foo baz');
        assert.strictEqual(cm({ '-foo': 1, '--bar': 1 }), '-foo --bar');
    });

    it('arrays', () => {
        assert.strictEqual(cm([]), '');
        assert.strictEqual(cm(['foo']), 'foo');
        assert.strictEqual(cm(['foo', 'bar']), 'foo bar');
        assert.strictEqual(cm(['foo', 0 && 'bar', 1 && 'baz']), 'foo baz');
    });

    it('arrays (nested)', () => {
        assert.strictEqual(cm([[[]]]), '');
        assert.strictEqual(cm([[['foo']]]), 'foo');
        assert.strictEqual(cm([['foo'], [[{ bar: 0 }], 'baz']]), 'foo baz');
        assert.strictEqual(cm(['foo', 0 && 'bar', 1 && 'baz']), 'foo baz');
    });

    it('arrays (no push escape)', () => {
        assert.strictEqual(cm({ push: 1 }), 'push');
        assert.strictEqual(cm({ pop: true }), 'pop');
        assert.strictEqual(cm({ push: true }), 'push');
        assert.strictEqual(cm('hello', { world: 1, push: true }), 'hello world push');
    });

    it('boolean', () => {
        assert.strictEqual(cm(true), '');
        assert.strictEqual(cm(false), '');
        assert.strictEqual(cm(true && 'foo'), 'foo');
        assert.strictEqual(cm(false && 'foo'), '');
        assert.strictEqual(cm('foo', true && 'bar'), 'foo bar');
        assert.strictEqual(cm('foo', false && 'bar'), 'foo');
        assert.strictEqual(cm(true ? 'foo' : 'bar'), 'foo');
        assert.strictEqual(cm(false ? 'foo' : 'bar'), 'bar');
        assert.strictEqual(cm('foo', true ? 'bar1' : 'bar2'), 'foo bar1');
        assert.strictEqual(cm('foo', false ? 'bar1' : 'bar2'), 'foo bar2');
        assert.strictEqual(cm('0'), '0');
        assert.strictEqual(cm('7'), '7');
    });

    it('functions', () => {
        const foo = () => {};

        assert.strictEqual(cm(foo, 'hello'), 'hello');
        assert.strictEqual(cm(foo, 'hello', cm), 'hello');
        assert.strictEqual(cm(foo, 'hello', [[cm], 'world']), 'hello world');
    });

    it('duplicates', () => {
        assert.strictEqual(cm('foo', 'foo', 'bar', 'bar'), 'foo bar');
    });
});

describe('extra tests', () => {
    it('keeps object keys with truthy values', () => {
        assert.equal(
            cm({
                a: true,
                b: false,
                c: 0,
                d: null,
                e: undefined,
                f: 1
            }),
            'a f'
        );
    });

    it('joins arrays of class names and ignore falsy values', () => {
        assert.equal(cm('a', 0, null, undefined, false, 'b'), 'a b');
    });

    it('supports heterogenous arguments', () => {
        assert.equal(cm({ a: true }, 'b', 0), 'a b');
    });

    it('should be trimmed', () => {
        assert.equal(cm('', 'b', {}, ''), 'b');
    });

    it('returns an empty string for an empty configuration', () => {
        assert.equal(cm({}), '');
    });

    it('supports an array of class names', () => {
        assert.equal(cm(['a', 'b']), 'a b');
    });

    it('joins array arguments with string arguments', () => {
        assert.equal(cm(['a', 'b'], 'c'), 'a b c');
        assert.equal(cm('c', ['a', 'b']), 'c a b');
    });

    it('handles multiple array arguments', () => {
        assert.equal(cm(['a', 'b'], ['c', 'd']), 'a b c d');
    });

    it('handles arrays that include falsy and true values', () => {
        assert.equal(cm(['a', 0, null, undefined, false, true, 'b']), 'a b');
    });

    it('handles arrays that include arrays', () => {
        assert.equal(cm(['a', ['b', 'c']]), 'a b c');
    });

    it('handles arrays that include objects', () => {
        assert.equal(cm(['a', { b: true, c: false }]), 'a b');
    });

    it('handles deep array recursion', () => {
        assert.equal(cm(['a', ['b', ['c', { d: true }]]]), 'a b c d');
    });

    it('handles arrays that are empty', () => {
        assert.equal(cm('a', []), 'a');
    });

    it('handles nested arrays that have empty nested arrays', () => {
        assert.equal(cm('a', [[]]), 'a');
    });

    it('handles all types of truthy and falsy property values as expected', () => {
        assert.equal(
            cm({
                // falsy:
                null: null,
                emptyString: '',
                noNumber: NaN,
                zero: 0,
                negativeZero: -0,
                false: false,
                undefined: undefined,

                // truthy (literally anything else):
                nonEmptyString: 'foobar',
                whitespace: ' ',
                function: Object.prototype.toString,
                emptyObject: {},
                nonEmptyObject: { a: 1, b: 2 },
                emptyList: [],
                nonEmptyList: [1, 2, 3],
                greaterZero: 1
            }),
            'nonEmptyString whitespace function emptyObject nonEmptyObject emptyList nonEmptyList greaterZero'
        );
    });

    it('handles toString() method defined on object', () => {
        assert.equal(
            cm({
                toString: () => {
                    return 'classFromMethod';
                }
            }),
            'classFromMethod'
        );
    });

    it('handles toString() method defined inherited in object', () => {
        class Class1 {
            toString() {
                return 'classFromMethod';
            }
        }
        class Class2 extends Class1 {}

        assert.equal(cm(new Class2()), 'classFromMethod');
    });

    // it('handles objects in a VM', () => {
    //     const context = { cm, output: undefined };
    //     vm.createContext(context);

    //     const code = 'output = cm({ a: true, b: true });';

    //     vm.runInContext(code, context);
    //     assert.equal(context.output, 'a b');
    // });
});

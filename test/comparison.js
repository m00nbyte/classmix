const assert = require('assert');
const clsx = require('clsx');
const classNames = require('classnames');
const classcat = require('classcat');
const classix = require('classix');

const cm = require('../dist/cjs/index.min.js');

const functions = {
    classmix: {
        fn: cm,
        tests: 'all'
    },
    clsx: {
        fn: clsx,
        tests: [
            'emptys',
            'strings',
            'numbers',
            'objects',
            'arrays',
            'arrays (nested)',
            'arrays (no push escape)',
            'boolean',
            'functions'
        ]
    },
    classNames: {
        fn: classNames,
        tests: [
            'emptys',
            'strings',
            'numbers',
            'objects',
            'arrays',
            'arrays (nested)',
            'arrays (no push escape)',
            'boolean',
            'functions'
        ]
    },
    classcat: {
        fn: classcat,
        tests: ['objects']
    },
    classix: {
        fn: classix.default,
        tests: ['emptys', 'strings', 'boolean']
    }
};

const tests = {
    emptys: (fn) => {
        assert.strictEqual(fn(''), '');
        assert.strictEqual(fn(undefined), '');
        assert.strictEqual(fn(null), '');
        assert.strictEqual(fn(0), '');
    },
    strings: (fn) => {
        assert.strictEqual(fn('foo'), 'foo');
        assert.strictEqual(fn('foo', 'bar'), 'foo bar');
        assert.strictEqual(fn(true && 'foo'), 'foo');
        assert.strictEqual(fn(false && 'foo'), '');
        assert.strictEqual(fn(true ? 'foo' : 'bar'), 'foo');
        assert.strictEqual(fn(false ? 'foo' : 'bar'), 'bar');
    },
    numbers: (fn) => {
        assert.strictEqual(fn(1), '1');
        assert.strictEqual(fn(12), '12');
        assert.strictEqual(fn(0.5), '0.5');
        assert.strictEqual(fn(1, 2), '1 2');
    },
    objects: (fn) => {
        assert.strictEqual(fn({}), '');
        assert.strictEqual(fn({ foo: true }), 'foo');
        assert.strictEqual(fn({ foo: true, bar: false }), 'foo');
        assert.strictEqual(fn({ foo: true, bar: 1 }), 'foo bar');
        assert.strictEqual(fn({ foo: 1, bar: 0, baz: 1 }), 'foo baz');
        assert.strictEqual(fn({ '-foo': 1, '--bar': 1 }), '-foo --bar');
    },
    arrays: (fn) => {
        assert.strictEqual(fn([]), '');
        assert.strictEqual(fn(['foo']), 'foo');
        assert.strictEqual(fn(['foo', 'bar']), 'foo bar');
        assert.strictEqual(fn(['foo', 0 && 'bar', 1 && 'baz']), 'foo baz');
    },
    'arrays (nested)': (fn) => {
        assert.strictEqual(fn([[[]]]), '');
        assert.strictEqual(fn([[['foo']]]), 'foo');
        assert.strictEqual(fn([['foo'], [[{ bar: 0 }], 'baz']]), 'foo baz');
        assert.strictEqual(fn(['foo', 0 && 'bar', 1 && 'baz']), 'foo baz');
    },
    'arrays (no push escape)': (fn) => {
        assert.strictEqual(fn({ push: 1 }), 'push');
        assert.strictEqual(fn({ pop: true }), 'pop');
        assert.strictEqual(fn({ push: true }), 'push');
        assert.strictEqual(fn('hello', { world: 1, push: true }), 'hello world push');
    },
    boolean: (fn) => {
        assert.strictEqual(fn(true), '');
        assert.strictEqual(fn(false), '');
        assert.strictEqual(fn(true && 'foo'), 'foo');
        assert.strictEqual(fn(false && 'foo'), '');
        assert.strictEqual(fn('foo', true && 'bar'), 'foo bar');
        assert.strictEqual(fn('foo', false && 'bar'), 'foo');
        assert.strictEqual(fn(true ? 'foo' : 'bar'), 'foo');
        assert.strictEqual(fn(false ? 'foo' : 'bar'), 'bar');
        assert.strictEqual(fn('foo', true ? 'bar1' : 'bar2'), 'foo bar1');
        assert.strictEqual(fn('foo', false ? 'bar1' : 'bar2'), 'foo bar2');
        assert.strictEqual(fn('0'), '0');
        assert.strictEqual(fn('7'), '7');
    },
    functions: (fn) => {
        const foo = () => {};

        assert.strictEqual(fn(foo, 'hello'), 'hello');
        assert.strictEqual(fn(foo, 'hello', fn), 'hello');
        assert.strictEqual(fn(foo, 'hello', [[fn], 'world']), 'hello world');
    },
    duplicates: (fn) => {
        assert.strictEqual(fn('foo', 'foo', 'bar', 'bar'), 'foo bar');
    }
};

describe('Module comparison tests', () => {
    Object.entries(functions).forEach(([name, { fn, tests: supportedTests }]) => {
        describe(name, () => {
            const runTests = supportedTests === 'all' ? Object.keys(tests) : supportedTests || [];

            runTests.forEach((item) => {
                it(item, () => {
                    tests[item]?.(fn);
                });
            });
        });
    });
});

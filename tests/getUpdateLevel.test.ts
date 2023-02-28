import { getUpdateLevel } from '../src/getUpdateLevel'

test.each([
    { a: '0.3.9', b: '0.4.4', c: '0.4.0', expected: 'patch' },
    { a: '0.3.9', b: '0.4.4', c: '0.3.10', expected: 'patch' },
    { a: '0.3.9', b: '0.5.4', c: '0.4.0', expected: 'minor' },
    { a: '1.8.0', b: '2.0.0', c: '1.9.0', expected: 'minor' },
    { a: '1.8.0', b: '3.0.0', c: '2.0.0', expected: 'major' },
])('if $a.version and $b.version exist, and input is $c.version, updateLevel is $expected',
    ({ a, b, c, expected }) => {
        expect(getUpdateLevel(a, b, c)).toEqual(expected)
    })

test.each([
    { a: '1.3.15', b: null, c: '1.3.16', expected: 'patch' },
    { a: '1.3.15', b: null, c: '1.4.0', expected: 'minor' },
    { a: '0.9.9', b: null, c: '1.0.0', expected: 'major' },
    { a: '3.5.9', b: null, c: '4.0.0', expected: 'major' },
])('if $a.version exist and no newer versions exist, and input is $c.version, updateLevel is $expected',
    ({ a, b, c, expected }) => {
        expect(getUpdateLevel(a, b, c)).toEqual(expected)
    })

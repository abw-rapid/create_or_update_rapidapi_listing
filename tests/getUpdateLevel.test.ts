import { SemVer } from 'semver'
import { getUpdateLevel } from '../src/getUpdateLevel'


test.each([
    { a: new SemVer('0.3.9'), b: new SemVer('0.4.4'), c: new SemVer('0.4.0'), expected: 'patch' },
    { a: new SemVer('0.3.9'), b: new SemVer('0.4.4'), c: new SemVer('0.3.10'), expected: 'patch' },
    { a: new SemVer('0.3.9'), b: new SemVer('0.5.4'), c: new SemVer('0.4.0'), expected: 'minor' },
    { a: new SemVer('1.8.0'), b: new SemVer('2.0.0'), c: new SemVer('1.9.0'), expected: 'minor' },
    { a: new SemVer('1.8.0'), b: new SemVer('3.0.0'), c: new SemVer('2.0.0'), expected: 'major' },
])('if $a.version and $b.version exist, and input is $c.version, updateLevel is $expected',
  ({a, b, c, expected}) => {
    expect(getUpdateLevel(a, b, c)).toEqual(expected)
  })

test.each([
    { a: new SemVer('1.3.15'), b: null, c: new SemVer('1.3.16'), expected: 'patch' },
    { a: new SemVer('1.3.15'), b: null, c: new SemVer('1.4.0'), expected: 'minor' },
    { a: new SemVer('0.9.9'), b: null, c: new SemVer('1.0.0'), expected: 'major' },
    { a: new SemVer('3.5.9'), b: null, c: new SemVer('4.0.0'), expected: 'major' },
])('if $a.version exist and no newer versions exist, and input is $c.version, updateLevel is $expected',
  ({a, b, c, expected}) => {
    expect(getUpdateLevel(a, b, c)).toEqual(expected)
  })

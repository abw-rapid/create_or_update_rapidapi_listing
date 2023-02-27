import { apiVersionExists } from '../src/apiVersion_already_exists'
import { apiVersion, apiVersions, apiVersionStatus } from '../src/types'
import { SemVer } from 'semver'

afterEach(() => {
    jest.restoreAllMocks()
  })

const versionList: apiVersions = {
    'nodes': [
      {
        id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-zzzzzzzzz059',
        name: new SemVer('0.5.9'),
        current: false,
        versionStatus: apiVersionStatus.active
      },
      {
        id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-ba02c06fb043',
        name: new SemVer('0.4.3'),
        current: true,
        versionStatus: apiVersionStatus.draft
      },
      {
        id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-zzzzzzzzz042',
        name: new SemVer('0.4.2'),
        current: false,
        versionStatus: apiVersionStatus.active
      },
      {
        id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-zzzzzzzz0510',
        name: new SemVer('0.5.10'),
        current: false,
        versionStatus: apiVersionStatus.active
      },
      {
        id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-zzzzzzzz$102',
        name: new SemVer('3.5.9'),
        current: false,
        versionStatus: apiVersionStatus.active
      },
      {
        id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-zzzzzzzzz102',
        name: new SemVer('1.0.2'),
        current: false,
        versionStatus: apiVersionStatus.active
      },
      {
        id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-zzzzzzzzz159',
        name: new SemVer('1.5.9'),
        current: false,
        versionStatus: apiVersionStatus.active
      },
      {
        id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-zzzzzzzzz062',
        name: new SemVer('0.6.2'),
        current: false,
        versionStatus: apiVersionStatus.active
      },
    ]
  }
  
const expectedResult = {
        id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-zzzzzzzz0510',
        name: new SemVer('0.5.10'),
        current: false,
        versionStatus: apiVersionStatus.active
      } as apiVersion

test('test that we find that a certain apiVersion already exists', () => {
    expect(apiVersionExists(versionList, new SemVer('0.5.10'))).toStrictEqual(expectedResult)
})

test('test that we find an emtpy apiVersion for a non-existent version', () => {
    expect(apiVersionExists(versionList, new SemVer('0.7.7'))).toStrictEqual({})
})
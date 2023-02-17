import { SemVer } from 'semver'
import { getCurrentVersion } from '../src/get_current_version'
import { apiVersions, apiVersionStatus } from '../src/types'

const currentVersionList: apiVersions = {
  'nodes': [
  {
    id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-ba02c06fbddb',
    name: new SemVer('0.4.3'),
    current: true,
    versionStatus: apiVersionStatus.DRAFT
  },
  {
    id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-zzzzzzzzzzzz',
    name: new SemVer('0.4.2'),
    current: false,
    versionStatus: apiVersionStatus.ACTIVE
  }
]
}
const expected = {
  id: 'apiversion_a6ee5ca5-3bca-47b0-95a6-ba02c06fbddb',
  name: new SemVer('0.4.3'),
  current: true,
  versionStatus: apiVersionStatus.DRAFT
}
test('gets the current version from a list of apiVersions', () => {
  expect(getCurrentVersion(currentVersionList)).toStrictEqual(expected)
})

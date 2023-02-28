import { apiVersion, apiVersions } from './types'

/**
 * Checks whether an apiVersion with a specific name (i.e. version number) already exists for an API
 * @param versionList List of apiVersions to check for the specific name (i.e. version number)
 * @param lookingFor The SemVer we are looking for
 * @returns {apiVersion} Returns an apiVersion object - it'll be an empty object ({}) if no existing version is found
 */
function apiVersionExists(versionList: apiVersions, lookingFor: string): apiVersion {
  let returnVersion = {} as apiVersion
  for (const versionFromList of versionList.nodes) {
    if (versionFromList.name === lookingFor) {
      returnVersion = versionFromList
      break
    }
  }
  return returnVersion
}

export { apiVersionExists }
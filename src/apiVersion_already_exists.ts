import { apiVersion, apiVersions } from './types'

/**
 * Checks whether an apiVersion with a specific name (i.e. version number) already exists for an API
 * @param {apiVersions} versionList List of apiVersions to check for the specific name (i.e. version number)
 * @param {string} lookingFor The version number we are looking for
 * @returns {apiVersion} apiVersion if found, empty apiVersion if not
 */
export function apiVersionExists(versionList: apiVersions, lookingFor: string): apiVersion {
  let returnVersion = {} as apiVersion
  for (const versionFromList of versionList.nodes) {
    if (versionFromList.name === lookingFor) {
      returnVersion = versionFromList
      break
    }
  }
  return returnVersion
}

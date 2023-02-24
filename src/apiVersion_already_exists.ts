import { GraphQLClient } from 'graphql-request'
import { apiVersion } from './types'
import { SemVer } from 'semver'

/**
 * Checks whether an apiVersion with a specific name (i.e. version number) already exists for an API
 * @param versionList List of apiVersions to check for the specific name (i.e. version number)
 * @param lookingFor The SemVer we are looking for
 * @returns {apiVersion} Returns an apiVersion object - it'll be an empty object ({}) if no existing version is found
 */






// find whether this version already exists
function isExisting(versionList: Array<apiVersion>, lookingFor: SemVer): apiVersion {
    let returnVersion = {} as apiVersion
    for (const versionFromList of versionList) {
      if (versionFromList.name.version === lookingFor.version) {
        returnVersion = versionFromList
        break
      }
    }
    return returnVersion
  }
import { NoApiVersionsFoundError } from './errors'
import { apiVersion, apiVersions } from './types'

/**
 * Select the version set as current from a list of api_versions <br/>
 * There should always be a single API version set as current, so this function always
 * returns a single object containing the name and id of the API version set as current.
 * @param {apiVersions} versions Array of apiVersion objects
 * @return {apiVersion} An object containing the name and id of the latest version of this API
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCurrentVersion (versions: apiVersions): apiVersion {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const current = versions.nodes.find((element: any) => element.current === true)
  if (current === undefined) {
    throw new NoApiVersionsFoundError(
      'No version is marked as current. That should be impossible!'
    )
  } else {
    return current
  }
}

export { getCurrentVersion }

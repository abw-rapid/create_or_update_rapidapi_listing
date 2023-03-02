import { GraphQLClient } from 'graphql-request'
import { apiVersion, apiVersions, apiVersionsResponseObject } from './types'
import { NoApiVersionsFoundError } from './errors'

/**
 * Fetch the id of the latest version of an API <br/>
 * This is only used for wholy new APIs: after creating a new API, we need to fetch 
 * the also created apiVersion in order to present that data to the user, because the mutation to
 * create an API does not provide information on the created apiVersion
 * @param {string} apiId The id of the API we want to get the latest version for
 * @param {GraphQLClient} client The GraphQL Client object for reuse
 * @return {Promise<apiVersion>} The apiVersion object for the newly created API's initial version
 */
export async function getCurrentApiVersion(apiId: string, client: GraphQLClient): Promise<apiVersion> {
    const query = `
    query apiVersions($where: ApiVersionWhereInput) {
        apiVersions(where: $where) {
          nodes {
            id
            name
            current
          }
        }
      }`

    const variables = {
        where: {
            apiId
        }
    }

    try {
        const result: apiVersionsResponseObject = await client.request(query, variables)
        if (result.apiVersions.nodes.length > 0) {
            return getCurrentVersion(result.apiVersions)
        } else {
            throw new Error(`No API versions found for ${apiId}`)
        }
    } catch (err) {
        console.log(err)
        throw new Error(`Unknown error while getting current API version for ${apiId}`)
    }
}

/**
 * Select the version marked as current from an apiVersions object <br/>
 * There should always be one single API version set as current, so this function always
 * returns a single apiVersion object
 * This function is only used by get_current_api_version above
 * @param {apiVersions} versions Array of apiVersion objects
 * @return {apiVersion} An apiVersion object for the apiVersion marked as current
 */
export function getCurrentVersion(versions: apiVersions): apiVersion {
    const current = versions.nodes.find((element: apiVersion) => element.current === true)
    if (current === undefined) {
        throw new NoApiVersionsFoundError(
            'No version is marked as current. That should be impossible!'
        )
    } else {
        return current
    }
}

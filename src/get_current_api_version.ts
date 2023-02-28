import { getCurrentVersion } from './get_current_version'
import { apiVersion, apiVersionsResponseObject } from './types'

/**
 * Fetch the id of the latest version of an API
 * @param {string} api_id The id of the API we want to get the latest version for
 * @param {object} client The GraphQL Client object for reuse
 * @return {object} An object containing the name and id of the latest version of this API
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCurrentApiVersion(apiId: string, client: any): Promise<apiVersion> {
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
            throw new Error('No API versions found')
        }
    } catch (err) {
        console.log(err)
        throw new Error('Unknown error in get_current_api_version')
    }
}

export { getCurrentApiVersion }
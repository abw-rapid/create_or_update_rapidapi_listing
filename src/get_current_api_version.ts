import { getCurrentVersion } from './get_current_version'
import { NoCurrentVersionError } from './errors'
import { apiVersion, apiVersionsResponseObject } from './types'
import { GraphQLClient } from 'graphql-request'

/**
 * Fetch the id of the latest version of an API
 * @param {string} apiId The id of the API we want to get the latest version for
 * @param {GraphQLClient} client The GraphQL Client object for reuse
 * @return {Promise<apiVersion>} An object containing the name and id of the latest version of this API
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCurrentApiVersion (apiId: string, client: GraphQLClient): Promise<apiVersion> {
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
      apiId,
    }
  }

  try {
    const res: apiVersionsResponseObject = await client.request(query, variables)
    if (res.apiVersions.nodes.length > 0) {
      return getCurrentVersion(res.apiVersions)
    } else {
      throw new NoCurrentVersionError('No API versions found')
    }
  } catch (err) {
    console.log(err)
    throw new Error('Unknown error in get_current_api_version')
  }
}

export { getCurrentApiVersion }

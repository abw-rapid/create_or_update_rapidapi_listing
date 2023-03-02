import { apiVersions, apiVersionsResponseObject } from './types'
import { NoApiVersionsFoundError } from './errors'
import { GraphQLClient } from 'graphql-request'

/**
 * Fetch the id of the latest version of an API
 * @param {string} apiId The id of the API we want to get the latest version for
 * @param {GraphQLClient} client The GraphQL Client object for reuse
 * @return {Promise<Array<apiVersion>>} An array containing the apiVersions for this apiId
 */
async function getApiVersions(apiId: string, client: GraphQLClient): Promise<apiVersions> {
  const query = `
    query apiVersions($where: ApiVersionWhereInput) {
        apiVersions(where: $where) {
          nodes {
            id
            name
            current
            versionStatus
          }
        }
      }`

  const variables = {
    where: {
      apiId,
    }
  }

  let result: apiVersionsResponseObject = {} as apiVersionsResponseObject
  try {
    result = await client.request(query, variables)
  } catch (err) {
    console.log(err)
    throw new Error('Unknown error in get_current_api_version')
  }

  if (result.apiVersions.nodes.length > 0) {
    return result.apiVersions
  } else {
    throw new NoApiVersionsFoundError('No existing API versions found: that should not be possible')
  }
}

export { getApiVersions }
import { apiVersions, apiVersionsResponseObject } from './types'
import { NoApiVersionsFoundError } from './errors'
import { GraphQLClient } from 'graphql-request'

/**
 * Fetch the apiVersions of an API on the Hub
 * The apiVersions (plural!) object is a part of the GraphQL response that is used throughout 
 * this code as the source of apiVersions for a specific API
 * TODO: it might make more sense to parse the apiVersions object into an array of apiVersion objects
 * @param {string} apiId The id of the API we want to get the latest version for
 * @param {GraphQLClient} client The GraphQL Client object for reuse
 * @return {Promise<apiVersions>} An array containing the apiVersions for this apiId
 */
export async function getApiVersions(apiId: string, client: GraphQLClient): Promise<apiVersions> {
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
    throw new Error(`Unknown error while getting API versions for ${apiId}`)
  }

  if (result.apiVersions.nodes.length > 0) {
    return result.apiVersions
  } else {
    throw new NoApiVersionsFoundError('No existing API versions found: that should not be possible')
  }
}

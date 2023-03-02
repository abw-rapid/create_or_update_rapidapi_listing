import { gql, GraphQLClient } from 'graphql-request'
import { UnexpectedResponseError } from './errors'
import { apiVersion, createApiVersionResponseObject } from './types'

/**
 * Creates and returns a new API version for a given API
 * @param {string} name Version name (i.e. version number) for the new API version
 * @param {string} apiId The id of the API to create a new version for
 * @param {GraphQLClient} client The GraphQL Client object for reuse
 * @returns {Promise<apiVersion>} An apiVersion object containing information on the newly created version
 */
export async function createApiVersion(name: string, apiId: string, client: GraphQLClient): Promise<apiVersion> {
  const mutation = gql`
    mutation createApiVersions($apiVersions: [ApiVersionCreateInput!]!) {
        createApiVersions(apiVersions: $apiVersions) {
            id
            name
            current
            api
            status
        }
    }`

  const params = {
    apiVersions: {
      api: apiId,
      name
    }
  }

  try {
    const res: createApiVersionResponseObject = await client.request(mutation, params)
    // res.createApiVersions is a single element array
    const response = res.createApiVersions[0]
    return response as apiVersion
  } catch (e) {
    console.log(e)
    throw new UnexpectedResponseError('Unknown error in create_api_version')
  }
}

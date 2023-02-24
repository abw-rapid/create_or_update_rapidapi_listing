import { gql, GraphQLClient } from 'graphql-request'
import { UnexpectedResponseError } from './errors'
import { apiVersion, createApiVersionResponseObject } from './types'

/**
 * Creates and returns a new API version for a given API
 * @param {string} name Version name or number for the new API version
 * @param {string} apiId The id of the API to create a new version for
 * @param {GraphQLClient} client The GraphQL Client object for reuse
 * @returns {Promise<apiVersion>} The id of the newly created API version
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createApiVersion (name: string, apiId: string, client: GraphQLClient): Promise<apiVersion> {
  const mutation = gql`
    mutation createApiVersions($apiVersions: [ApiVersionCreateInput!]!) {
        createApiVersions(apiVersions: $apiVersions) {
            id
            api
            current
            name
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
    return res.createApiVersions[0]
  } catch (e) {
    console.log(e.response.errors)
    throw new UnexpectedResponseError('Unknown error in create_api_version')
  }
}

export { createApiVersion }

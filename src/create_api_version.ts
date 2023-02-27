import { gql, GraphQLClient } from 'graphql-request'
import { SemVer } from 'semver'
import { UnexpectedResponseError } from './errors'
import { apiVersion, createApiVersionResponseObject } from './types'

/**
 * Creates and returns a new API version for a given API
 * @param {string} SemVer Version name or number for the new API version
 * @param {string} apiId The id of the API to create a new version for
 * @param {GraphQLClient} client The GraphQL Client object for reuse
 * @returns {Promise<apiVersion>} The id of the newly created API version
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createApiVersion (name: SemVer, apiId: string, client: GraphQLClient): Promise<apiVersion> {
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
      name: name.raw
    }
  }

  try {
    const res: createApiVersionResponseObject = await client.request(mutation, params)
    const response = res.createApiVersions[0]
    response.name = new SemVer(response.name)
    return response as apiVersion
  } catch (e) {
    console.log(e)
    throw new UnexpectedResponseError('Unknown error in create_api_version')
  }
}

export { createApiVersion }

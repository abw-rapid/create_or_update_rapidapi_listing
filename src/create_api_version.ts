import { gql } from 'graphql-request'
import { UnexpectedResponseError } from './errors'
import { inspect } from 'util'

/**
 * Creates and returns a new API version for a given API
 * @param {*} version_name Version name or number for the new API version
 * @param {*} api_id The id of the API to create a new version for
 * @param {object} client The GraphQL Client object for reuse
 * @returns {string} The id of the newly created API version
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createApiVersion (name: string, api: string, client: any): Promise<string> {
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
      api,
      name
    }
  }

  try {
    const res = await client.request(mutation, params)
    if (res.errors !== undefined) {
      const graphqlError = res.errors[0].messages as string
      throw new UnexpectedResponseError(
                `Unable to create new API version: ${graphqlError}`
      )
    } else {
      return res.createApiVersions[0].id
    }
  } catch (err) {
    console.log(inspect(err.response.errors))
    throw new Error('Unknown error in create_api_version')
  }
}

export { createApiVersion }

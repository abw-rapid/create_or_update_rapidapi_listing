import { gql } from 'graphql-request'
import { PlatformAPIError } from './errors'

/**
 * Set the newly created version of the API as the current one
 * @param {string} api_version_id
 * @param {object} client The GraphQL Client object for reuse
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function setCreatedVersionAsActive (apiVersionId: string, client: any): Promise<boolean> {
  const mutation = gql`
        mutation updateApiVersions($apiVersions: [ApiVersionUpdateInput!]!) {
          updateApiVersions(apiVersions: $apiVersions) {
            id
          }
        }
    `

  const variables = {
    apiVersions: [
      {
        apiVersionId,
        current: true,
        versionStatus: 'active'
      }
    ]
  }

  try {
    await client.request(mutation, variables)
    return true
  } catch (err) {
    const graphqlError = err as string
    throw new PlatformAPIError(`Platform API error: ${graphqlError}`)
  }
}

export { setCreatedVersionAsActive }

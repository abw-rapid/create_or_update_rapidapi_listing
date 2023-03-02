import { gql, GraphQLClient } from 'graphql-request'
import { PlatformAPIError } from './errors'
import { apiVersion, apiVersionStatus } from './types'

/**
 * Set the status of the newly created apiVersion to draft, active or deprecated
 * @param {apiVersion} apiVersionToSetStatus apiVersion object of the API version we want to set the versionStatus for
 * @param {apiVersionStatus} desiredStatus the desired versionStatus (draft, active or deprecated)
 * @param {object} client The GraphQL Client object for reuse
 * @returns {Promise<boolean>} Returns true if succeeded, throws otherwise 
 */
export async function setApiStatus(apiVersionToSetStatus: apiVersion, desiredStatus: apiVersionStatus, client: GraphQLClient): Promise<boolean> {
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
        apiVersionId: apiVersionToSetStatus.id,
        versionStatus: desiredStatus as string
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

/**
 * Set the newly created version of the API as the current one
 * @param {string} api_version_id
 * @param {object} client The GraphQL Client object for reuse
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function setApiCurrent(apiVersionToSetAsCurrent: apiVersion, client: any): Promise<boolean> {
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
        apiVersionId: apiVersionToSetAsCurrent.id,
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

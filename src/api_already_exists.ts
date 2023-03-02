import { GraphQLClient } from 'graphql-request'
import { api, apiResponseObject } from './types'
import { MultipleAPIsFoundError } from './errors'

/**
 * Checks whether an API already exists<br>
 * Returns the existing API if it already exists<br>
 * Returns empty api object if it does not already exists
 * @param {string} name Name of the API to check
 * @param {number} ownerId The id of the owner of the API we are looking for
 * @param {GraphQLClient} client The GraphQL Client object for reuse
 * @return {Promise<api>} The existing API
 */
export async function alreadyExists(name: string, ownerId: number, client: GraphQLClient): Promise<api> {
  const query = `
    query api($where: ApiWhereInput) {
        apis(where: $where) {
          nodes {
            id
            name
          }
        }
      }`

  const variables = {
    where: {
      name,
      ownerId
    }
  }

  const res: apiResponseObject = await client.request(query, variables)
  const apis = res.apis

  if (apis.nodes.length === 0) {
    return {} as api
  } else if (apis.nodes.length === 1) {
    return apis.nodes[0]
  } else {
    console.log(apis.nodes)
    throw new MultipleAPIsFoundError(`Multiple APIs found called ${name} belonging to ${ownerId}; that shouldn't happen.`)
  }
}

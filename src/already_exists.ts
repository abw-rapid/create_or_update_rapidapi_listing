import { GraphQLClient } from 'graphql-request'
import { apiResponseObject } from './types'

/**
 * Checks whether an API already exists<br>
 * Returns the id of the existing API if it already exists<br>
 * Returns null if not
 * @param {string} name Name of the API to check
 * @param {number} ownerId The id of the owner of the API we are looking for
 * @param {GraphQLClient} client The GraphQL Client object for reuse
 * @return {Promise<string>} The id of the existing API
 */
async function alreadyExists (name: string, ownerId: number, client: GraphQLClient): Promise<string> {
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
    return '__not_found__'
  } else if (apis.nodes.length === 1) {
    const first_api = apis.nodes[0]
    return first_api.id
  } else {
    console.log(apis.nodes)
    throw new Error(`More than one API found with name ${name}; that shouldn't happen.`)
  }
}

export { alreadyExists }

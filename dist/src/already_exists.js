"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alreadyExists = void 0;
/**
 * Checks whether an API already exists<br>
 * Returns the id of the existing API if it already exists<br>
 * Returns null if not
 * @param {string} name Name of the API to check
 * @param {number} ownerId The id of the owner of the API we are looking for
 * @param {GraphQLClient} client The GraphQL Client object for reuse
 * @return {Promise<string>} The id of the existing API
 */
async function alreadyExists(name, ownerId, client) {
    const query = `
    query api($where: ApiWhereInput) {
        apis(where: $where) {
          nodes {
            id
            name
          }
        }
      }`;
    const variables = {
        where: {
            name,
            ownerId
        }
    };
    const data = await client.request(query, variables);
    if (data.apis.nodes.length === 0) {
        return "0";
    }
    else if (data.apis.nodes.length === 1) {
        return data.apis.nodes[0].id;
    }
    else {
        throw new Error(`More than one API found with name ${name}; that shouldn't happen.`);
    }
}
exports.alreadyExists = alreadyExists;

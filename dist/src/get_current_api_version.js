"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentApiVersion = void 0;
const graphql_request_1 = require("graphql-request");
const get_current_version_js_1 = require("./get_current_version.js");
const errors_js_1 = require("./errors.js");
/**
 * Fetch the id of the latest version of an API
 * @param {string} api_id The id of the API we want to get the latest version for
 * @param {object} client The GraphQL Client object for reuse
 * @return {object} An object containing the name and id of the latest version of this API
 */
async function getCurrentApiVersion(apiId, client) {
    const query = (0, graphql_request_1.gql) `
    query apiVersions($where: ApiVersionWhereInput) {
        apiVersions(where: $where) {
          nodes {
            id
            name
            current
          }
        }
      }`;
    const variables = {
        where: {
            apiId,
            versionStatus: 'ACTIVE'
        }
    };
    try {
        const res = await client.request(query, variables);
        if (res.apiVersions.nodes.length > 0) {
            return (0, get_current_version_js_1.getCurrentVersion)(res.apiVersions.nodes);
        }
        else {
            throw new errors_js_1.NoCurrentVersionError('No API versions found');
        }
    }
    catch (err) {
        console.log(err);
        throw new Error('Unknown error in get_current_api_version');
    }
}
exports.getCurrentApiVersion = getCurrentApiVersion;

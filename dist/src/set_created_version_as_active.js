"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCreatedVersionAsActive = void 0;
const graphql_request_1 = require("graphql-request");
const errors_js_1 = require("./errors.js");
/**
 * Set the newly created version of the API as the current one
 * @param {string} api_version_id
 * @param {object} client The GraphQL Client object for reuse
 */
async function setCreatedVersionAsActive(apiVersionId, client) {
    const mutation = (0, graphql_request_1.gql) `
        mutation updateApiVersions($apiVersions: [ApiVersionUpdateInput!]!) {
          updateApiVersions(apiVersions: $apiVersions) {
            id
          }
        }
    `;
    const variables = {
        apiVersions: [
            {
                apiVersionId,
                current: true,
                versionStatus: 'active'
            }
        ]
    };
    try {
        await client.request(mutation, variables);
    }
    catch (err) {
        throw new errors_js_1.PlatformAPIError(`Platform API error: ${err}`);
    }
}
exports.setCreatedVersionAsActive = setCreatedVersionAsActive;

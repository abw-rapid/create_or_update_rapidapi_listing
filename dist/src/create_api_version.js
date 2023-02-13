"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiVersion = void 0;
const graphql_request_1 = require("graphql-request");
const errors_js_1 = require("./errors.js");
const util_1 = require("util");
/**
 * Creates and returns a new API version for a given API
 * @param {*} version_name Version name or number for the new API version
 * @param {*} api_id The id of the API to create a new version for
 * @param {object} client The GraphQL Client object for reuse
 * @returns {string} The id of the newly created API version
 */
async function createApiVersion(name, api, client) {
    const mutation = (0, graphql_request_1.gql) `
    mutation createApiVersions($apiVersions: [ApiVersionCreateInput!]!) {
        createApiVersions(apiVersions: $apiVersions) {
            id
            api
            current
            name
            status
        }
    }`;
    const params = {
        apiVersions: [{
                api,
                name
            }]
    };
    try {
        const res = await client.request(mutation, params);
        if (res.errors !== undefined) {
            throw new errors_js_1.UnexpectedResponseError(`Unable to create new API version: ${res.errors[0].message}`);
        }
        else {
            return res.createApiVersions[0].id;
        }
    }
    catch (err) {
        console.log((0, util_1.inspect)(err.response.errors));
        throw new Error('Unknown error in create_api_version');
    }
}
exports.createApiVersion = createApiVersion;

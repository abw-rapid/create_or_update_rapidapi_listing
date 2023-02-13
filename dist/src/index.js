#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const already_exists_js_1 = require("./already_exists.js");
const parse_spec_js_1 = require("./parse_spec.js");
const create_api_version_js_1 = require("./create_api_version.js");
const create_new_listing_js_1 = require("./create_new_listing.js");
const get_current_api_version_js_1 = require("./get_current_api_version.js");
const headers_js_1 = require("./headers.js");
const read_spec_js_1 = require("./read_spec.js");
const update_api_version_js_1 = require("./update_api_version.js");
const core = require('@actions/core');
const graphql = require('graphql-request');
const semver = require('semver');
async function main() {
    const specPath = core.getInput('SPEC_PATH', { required: true });
    const graphqlUrl = core.getInput('GRAPHQL_URL', { required: true });
    const ownerId = core.getInput('OWNER_ID', { required: true });
    // We're making two to three API calls to the GraphQL PAPI with the same headers, so
    // let's re-use a single client object
    const client = new graphql.GraphQLClient(graphqlUrl, {
        headers: (0, headers_js_1.graphqlHeaders)()
    });
    const spec = (0, read_spec_js_1.readSpec)(specPath);
    const name = (0, parse_spec_js_1.apiNameFromSpec)(spec);
    const apiId = await (0, already_exists_js_1.alreadyExists)(name, ownerId, client);
    if (apiId != "0") {
        // Provide some data about the API
        const currentVersion = await (0, get_current_api_version_js_1.getCurrentApiVersion)(apiId, client);
        const parsedCurrentVersion = currentVersion.name;
        const parsedSpecVersion = (0, parse_spec_js_1.apiVersionFromSpec)(spec);
        console.log('=> This is an existing API');
        console.log('  The API id is:   ' + apiId);
        console.log('  Version on Hub:  ' + parsedCurrentVersion);
        console.log('  Version in spec: ' + parsedSpecVersion);
        // Only create a new API version if the provided spec's version is higher than
        // the version already on the Hub
        const specIsNewer = semver.gt(parsedSpecVersion, parsedCurrentVersion);
        console.log('=> Uploaded spec is newer: ' + specIsNewer);
        if (specIsNewer) {
            console.log('   Creating new API version in Hub...');
            const newVersionId = await (0, create_api_version_js_1.createApiVersion)(parsedSpecVersion, apiId, client);
            console.log('   => New version id: ' + newVersionId);
            await (0, update_api_version_js_1.updateApiVersion)(specPath, newVersionId);
            console.log('   Successfully uploaded new API version into the Hub!');
            // Set output variables for re-use in later actions, if need be
            core.setOutput('api_id', apiId);
            core.setOutput('api_version_name', parsedSpecVersion);
            core.setOutput('api_version_id', newVersionId);
        }
        else {
            console.warn('   Spec version was not newer than version on Hub...');
            console.warn('   Not creating new version.');
        }
        core.setOutput('api_id', apiId);
    }
    else {
        const newApi = await (0, create_new_listing_js_1.createNewListing)(specPath);
        const initialVersion = await (0, get_current_api_version_js_1.getCurrentApiVersion)(newApi, client);
        console.log('=> This is a new API');
        console.log('   New api id: ' + newApi);
        console.log('   Initial version id: ' + initialVersion.id);
        // Set output variables for re-use in later actions, if need be
        core.setOutput('api_id', newApi);
        core.setOutput('api_version_name', initialVersion.name);
        core.setOutput('api_version_id', initialVersion.id);
    }
}
main().catch((error) => console.error(error));

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApiVersion = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const form_data_1 = __importDefault(require("form-data"));
const core = __importStar(require("@actions/core"));
const headers_js_1 = require("./headers.js");
const errors_js_1 = require("./errors.js");
/**
 * Creates and returns a new API version for a given API
 * @param {*} version_name Version name or number for the new API version
 * @param {*} api_id The id of the API to create a new version for
 * @param {object} client The GraphQL Client object for reuse
 * @returns {string} The id of the newly created API version
 */
async function updateApiVersion(specPath, apiVersionId) {
    const graphqlUrl = core.getInput('GRAPHQL_URL', { required: true });
    const query = `
        mutation updateApisFromRapidOas($updates: [ApiUpdateFromRapidOasInput!]!) {
        updateApisFromRapidOas(updates: $updates) {
            apiId
        }
    }`;
    const variables = {
        updates: {
            spec: null,
            apiVersionId
        }
    };
    const updatesFile = fs_1.default.readFileSync(specPath);
    const fd = new form_data_1.default();
    fd.append('operations', JSON.stringify({ query, variables }));
    fd.append('map', '{"0":["variables.updates.spec"]}');
    fd.append('0', updatesFile, {
        filename: 'spec.json',
        contentType: 'application/json'
    });
    const options = {
        method: 'POST',
        url: graphqlUrl,
        headers: Object.assign((0, headers_js_1.formGraphqlHeaders)(), fd.getHeaders()),
        data: fd
    };
    const res = await axios_1.default.request(options);
    if (res.status === 200 && !res.data.errors) {
        return res.status;
    }
    else if (res.status === 200 &&
        res.data.errors &&
        typeof res.data.errors === 'object') {
        // this happens when an unknown collection is part of the spec; we get a 200, but
        // also an unprocessable_entity error :/
        let errorMessage = new Array();
        res.data.errors.forEach((value) => errorMessage.push(value.message));
        throw new errors_js_1.SpecParsingError(`Error parsing spec: ${errorMessage}`);
    }
    else {
        throw new errors_js_1.UnexpectedStatusError(`HTTP status is not 200, but ${res.status}`);
    }
}
exports.updateApiVersion = updateApiVersion;

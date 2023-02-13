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
exports.createNewListing = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const core = __importStar(require("@actions/core"));
const errors_js_1 = require("./errors.js");
const headers_js_1 = require("./headers.js");
/**
 * Creates a new API listing on the RapidAPI (Enterprise) Hub
 *
 * @param {string} filename Filename of the OAS to be uploaded
 * @return {string} The id of the newly created API
 */
async function createNewListing(specPath) {
    const graphqlUrl = core.getInput('GRAPHQL_URL', { required: true });
    const query = `
    mutation createApisFromRapidOas($creations: [ApiCreateFromRapidOasInput!]!) {
        createApisFromRapidOas(creations: $creations) {
        apiId
        
        }
    }`;
    const variables = {
        creations: {
            spec: null
        }
    };
    const creationsFile = fs_1.default.readFileSync(specPath);
    const fd = new form_data_1.default();
    fd.append('operations', JSON.stringify({ query, variables }));
    fd.append('map', '{"0":["variables.creations.spec"]}');
    fd.append('0', creationsFile, {
        filename: 'spec.json',
        contentType: 'application/json'
    });
    const options = {
        method: 'POST',
        url: graphqlUrl,
        headers: Object.assign((0, headers_js_1.formGraphqlHeaders)(), fd.getHeaders()),
        data: fd
    };
    try {
        const res = await axios_1.default.request(options);
        if (res.status === 200) {
            return res.data.data.createApisFromRapidOas[0].apiId;
        }
        else {
            throw new errors_js_1.UnexpectedStatusError(`HTTP status is not 201, but ${res.status}`);
        }
    }
    catch (err) {
        throw new errors_js_1.PlatformAPIError(`Platform API error: ${err}`);
    }
}
exports.createNewListing = createNewListing;

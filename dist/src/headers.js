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
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlHeaders = exports.formGraphqlHeaders = void 0;
const core = __importStar(require("@actions/core"));
function formGraphqlHeaders() {
    const xRapidapiKey = core.getInput('X_RAPIDAPI_KEY', { required: true });
    const xRapidapiIdentityKey = core.getInput('X_RAPIDAPI_IDENTITY_KEY', { required: false });
    const xRapidapiGraphqlHost = core.getInput('X_RAPIDAPI_GRAPHQL_HOST', {
        required: true
    });
    return {
        'content-type': 'multipart/form-data',
        'x-rapidapi-key': xRapidapiKey,
        'x-rapidapi-identity-key': xRapidapiIdentityKey,
        'x-rapidapi-host': xRapidapiGraphqlHost
    };
}
exports.formGraphqlHeaders = formGraphqlHeaders;
function graphqlHeaders() {
    const xRapidapiKey = core.getInput('X_RAPIDAPI_KEY', { required: true });
    const xRapidapiIdentityKey = core.getInput('X_RAPIDAPI_IDENTITY_KEY', { required: false });
    const xRapidapiGraphqlHost = core.getInput('X_RAPIDAPI_GRAPHQL_HOST', {
        required: true
    });
    return {
        'content-type': 'application/json',
        'x-rapidapi-key': xRapidapiKey,
        'x-rapidapi-identity-key': xRapidapiIdentityKey,
        'x-rapidapi-host': xRapidapiGraphqlHost
    };
}
exports.graphqlHeaders = graphqlHeaders;

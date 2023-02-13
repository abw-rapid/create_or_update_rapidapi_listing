"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiDescriptionFromSpec = exports.apiNameFromSpec = exports.apiVersionFromSpec = void 0;
const semver_1 = require("semver");
const errors_js_1 = require("./errors.js");
/**
 * Return the version field of a spec file
 * @param {string} spec The contents of a spec file
 * @returns {string} The contents of the version field in the info block
 */
function apiVersionFromSpec(spec) {
    if (spec.info.version === undefined) {
        throw new errors_js_1.SpecParsingError("No property 'version' in spec");
    }
    else {
        if ((0, semver_1.valid)(spec.info.version)) {
            return spec.info.version;
        }
        else {
            throw new errors_js_1.SpecParsingError(`Not a valid version according to semver: ${spec.info.version}`);
        }
    }
}
exports.apiVersionFromSpec = apiVersionFromSpec;
/**
 * Return the name (title) field of a spec file
 * @param {string} spec The contents of a spec file
 * @returns {string} The contents of the title field in the info block
 */
function apiNameFromSpec(spec) {
    if (spec.info.title === undefined) {
        throw new errors_js_1.SpecParsingError("No property 'title' in spec");
    }
    else {
        return spec.info.title;
    }
}
exports.apiNameFromSpec = apiNameFromSpec;
/**
 * Return the description field of a spec file
 * @param {string} spec The contents of a spec file
 * @returns {string} The contents of the description field in the info block
 */
function apiDescriptionFromSpec(spec) {
    if (spec.info.description === undefined) {
        throw new errors_js_1.SpecParsingError("No property 'description' in spec");
    }
    else {
        return spec.info.description;
    }
}
exports.apiDescriptionFromSpec = apiDescriptionFromSpec;

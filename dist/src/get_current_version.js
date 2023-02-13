"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentVersion = void 0;
const semver_1 = require("semver");
const errors_js_1 = require("./errors.js");
/**
 * Select the version set as current from a list of api_versions <br/>
 * There should always be a single API version set as current, so this function always
 * returns a single object containing the name and id of the API version set as current.
 * @param {array} versions List of version objects
 * @return {object} An object containing the name and id of the latest version of this API
 */
function getCurrentVersion(versions) {
    const current = versions.find((element) => element.current === true);
    if (current === undefined) {
        throw new errors_js_1.NoCurrentVersionError('No version is marked as current. That should be impossible!');
    }
    else {
        if ((0, semver_1.valid)(current.name) != null) {
            return {
                name: current.name,
                id: current.id
            };
        }
        else {
            throw new errors_js_1.SpecParsingError(`Not a valid version according to semver: ${current.name}`);
        }
    }
}
exports.getCurrentVersion = getCurrentVersion;

import { lt, gt, parse, SemVer } from 'semver'
import { SpecParsingError } from './errors'
import { apiVersion, apiVersions } from './types'

/**
 * Figure out if there are newer apiVersion objects in the versionList than what we are offered as lookingFor
 * @param {apiVersions} versionList An apiVersions object containing all version we got from the Hub
 * @param {string} lookingFor A string representing a version number
 * @return {Array<apiVersion>} An array containing all apiVersion objects newer than lookingFor
 */
export function findNewer(versionList: apiVersions, lookingFor: string): Array<apiVersion> {
    const returnVersions: Array<apiVersion> = []
    for (const versionFromList of versionList.nodes) {
        if (gt(versionFromList.name, lookingFor)) {
            returnVersions.push(versionFromList)
        }
    }
    return returnVersions
}

/**
 * Figure out if there are older apiVersion objects in the versionList than what we are offered as lookingFor
 * @param {apiVersions} versionList An apiVersions object containing all version we got from the Hub
 * @param {string} lookingFor A string representing a version number
 * @return {Array<apiVersion>} An array containing all apiVersion objects older than lookingFor
 */
export function findOlder(versionList: apiVersions, lookingFor: string): Array<apiVersion> {
    const returnVersions = versionList.nodes.filter(apiVersion =>
        lt(apiVersion.name, lookingFor)
    )
    return returnVersions
}

/**
 * Given a array of apiVersion objects, returns the apiVersion object that is closest to lookingFor
 * This is used to determine whether this is a patch, minor or major update
 * @param {Array<apiVersion>} versionList An array of apiVersion objects -> different from the functions above!
 * @param {string} lookingFor A string representing a version number
 * @return {apiVersion} The apiVersion object that is closest to lookingFor
 */
export function findClosest(versionList: Array<apiVersion>, lookingFor: string): apiVersion {
    const specVersion = parse(lookingFor)
    let offsets: Array<number> = []
    offsets = versionList.map(apiVersion => {
        const hubVersion = parse(apiVersion.name)
        if (specVersion instanceof SemVer && hubVersion instanceof SemVer) {
            return Math.abs(
                (hubVersion.major * 100 + hubVersion.minor * 10 + hubVersion.patch) -
                (specVersion.major * 100 + specVersion.minor * 10 + specVersion.patch)
            )
        } else {
            throw new SpecParsingError("Either spec or existing version isn't SemVer")
        }
    })
    const minOffset = Math.min.apply(null, offsets)
    return versionList[offsets.indexOf(minOffset)]
}

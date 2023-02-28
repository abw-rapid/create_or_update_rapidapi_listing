import { lt, gt, parse, SemVer } from 'semver'
import { SpecParsingError } from './errors'
import { apiVersion, apiVersions } from './types'

// figure out if there is a newer apiVersion than what we are offered in the list
// returns the first newer version found
export function findNewer(versionList: apiVersions, lookingFor: string): Array<apiVersion> {
    const returnVersions: Array<apiVersion> = []
    for (const versionFromList of versionList.nodes) {
        if (gt(versionFromList.name, lookingFor)) {
            returnVersions.push(versionFromList)
        }
    }
    return returnVersions
}

// Create a new array containing only *older* apiVersions than the one we are working with
export function findOlder(versionList: apiVersions, lookingFor: string): Array<apiVersion> {
    const droppedNewer = versionList.nodes.filter(apiVersion =>
        lt(apiVersion.name, lookingFor)
    )
    return droppedNewer
}

// find closest existing apiVersion for a given apiVersion
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

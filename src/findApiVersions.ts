import { lt, gt, SemVer } from 'semver'
import { apiVersion, apiVersions } from './types'

// figure out if there is a newer apiVersion than what we are offered in the list
// returns the first newer version found
export function findNewer(versionList: apiVersions, lookingFor: SemVer): Array<apiVersion> {
    const returnVersions: Array<apiVersion> = []
    console.log("version: ", versionList)
    for (const versionFromList of versionList.nodes) { 
        if (gt(versionFromList.name, lookingFor.version)) { //TODO: removed .version from here; test will fail?
            returnVersions.push(versionFromList)
        }
    }
    return returnVersions
}

// Create a new array containing only *older* apiVersions than the one we are working with
export function findOlder(versionList: apiVersions, lookingFor: SemVer): Array<apiVersion> {
    const droppedNewer = versionList.nodes.filter(apiVersion =>
        lt(apiVersion.name, lookingFor.version)
    )
    console.log(droppedNewer)
    return droppedNewer
}

// find closest existing apiVersion for a given apiVersion
export function findClosest(versionList: Array<apiVersion>, lookingFor: SemVer): apiVersion {
    const offsets = versionList.map(apiVersion => {
        return Math.abs(
            (apiVersion.name.major * 100 + apiVersion.name.minor * 10 + apiVersion.name.patch) -
            (lookingFor.major * 100 + lookingFor.minor * 10 + lookingFor.patch)
        )
    })
    const minOffset = Math.min.apply(null, offsets)
    return versionList[offsets.indexOf(minOffset)]
}

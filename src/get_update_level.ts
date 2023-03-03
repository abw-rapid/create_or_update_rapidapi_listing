import { diff } from 'semver'

/**
 * Get the "level" of the update the provided spec would result into (major, minor or patch)
 * 
 * @param {string|null} closestOlder string containing the version of the closest newer version
 * of "null" if no older versions exist
 * @param {string|null} closestNewer string containing the version of the closest newer version
 * or "null" if no newer versions exist
 * @param {string} uploadedApiVersion string containing the version number of the new spec
 * @return {Promise<boolean>} An apiPolicy object containing information on how to handle the new apiVersion
 */
export function getUpdateLevel(closestOlder: string | null, closestNewer: string | null, uploadedApiVersion: string): string {
  const diffs: Array<string | null> = []
  if (closestOlder) { diffs.push(diff(closestOlder, uploadedApiVersion)) }
  if (closestNewer) { diffs.push(diff(closestNewer, uploadedApiVersion)) }
  if (diffs.includes('patch')) {
    return 'patch'
  } else if (diffs.includes('minor')) {
    return 'minor'
  }
  return 'major'
}
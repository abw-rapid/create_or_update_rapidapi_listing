import { diff } from 'semver'

// returns the updateLevel of the provided spec in relation to the closest 
// version we received or null if either of the two SemVers aren't Semvers; which
// really shouldn't happen...
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
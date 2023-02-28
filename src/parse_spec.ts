import { parse, SemVer } from 'semver'
import { SpecParsingError } from './errors'

/**
 * Return the version field of a spec file
 * @param {object} spec The contents of a spec file (parsed json object)
 * @returns {string} The contents of the version field in the info block
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getApiVersionFromSpec (spec: any): SemVer {
  if (spec.info.version === undefined) {
    throw new SpecParsingError("No property 'version' in spec")
  } else {
    const version = parse(spec.info.version)
    if (version !== null) {
      return version
    } else {
      const brokenVersion = spec.info.version as string
      throw new SpecParsingError(
                `Not a valid version according to semver: ${brokenVersion}`
      )
    }
  }
}

/**
 * Return the name (title) field of a spec file
 * @param {string} spec The contents of a spec file (valid json)
 * @returns {string} The contents of the title field in the info block
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getApiNameFromSpec (spec: any): string {
  if (spec.info.title === undefined) {
    throw new SpecParsingError("No property 'title' in spec")
  } else {
    return spec.info.title
  }
}

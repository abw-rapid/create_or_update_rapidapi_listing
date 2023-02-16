import { valid } from 'semver'
import { SpecParsingError } from './errors'

/**
 * Return the version field of a spec file
 * @param {object} spec The contents of a spec file (valid json)
 * @returns {string} The contents of the version field in the info block
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function apiVersionFromSpec (spec: any): string {
  if (spec.info.version === undefined) {
    throw new SpecParsingError("No property 'version' in spec")
  } else {
    if (valid(spec.info.version) != null) {
      return spec.info.version
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
function apiNameFromSpec (spec: any): string {
  if (spec.info.title === undefined) {
    throw new SpecParsingError("No property 'title' in spec")
  } else {
    return spec.info.title
  }
}

/**
 * Return the description field of a spec file
 * @param {string} spec The contents of a spec file (valid json)
 * @returns {string} The contents of the description field in the info block
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function apiDescriptionFromSpec (spec: any): string {
  if (spec.info.description === undefined) {
    throw new SpecParsingError("No property 'description' in spec")
  } else {
    return spec.info.description
  }
}

export { apiVersionFromSpec, apiNameFromSpec, apiDescriptionFromSpec }
import { valid } from 'semver'
import { SpecParsingError } from './errors'

/**
 * Return the version field of a spec file
 * @param {object} spec The contents of a spec file (valid json)
 * @returns {string} The contents of the version field in the info block
 */
function apiVersionFromSpec (spec: any) {
  if (spec.info.version === undefined) {
    throw new SpecParsingError("No property 'version' in spec")
  } else {
    if (valid(spec.info.version)) {
      return spec.info.version
    } else {
      throw new SpecParsingError(
                `Not a valid version according to semver: ${spec.info.version}`
      )
    }
  }
}

/**
 * Return the name (title) field of a spec file
 * @param {string} spec The contents of a spec file (valid json)
 * @returns {string} The contents of the title field in the info block
 */
function apiNameFromSpec (spec: any) {
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
function apiDescriptionFromSpec (spec: any) {
  if (spec.info.description === undefined) {
    throw new SpecParsingError("No property 'description' in spec")
  } else {
    return spec.info.description
  }
}

export { apiVersionFromSpec, apiNameFromSpec, apiDescriptionFromSpec }

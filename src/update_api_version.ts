import axios from 'axios'
import * as fs from 'fs'
import FormData = require('form-data')
import * as core from '@actions/core'
import { formGraphqlHeaders } from '../src/headers'
import { SpecParsingError, UnexpectedStatusError } from '../src/errors'

/**
 * Creates and returns a new API version for a given API
*  The return value is a bit strange, because we cannot give back any useful information about the
*  updated API or updated API version, since the only thing we can get back from the mutation is 
*  the apiID (which we already have), a trackingId (which doesn't help us much) and an array of warnings,
*  which we aren't handling at the moment. At some point we might return either an empty array of
*  strings or an array of warnings.
 * @param {string} specPath Version name or number for the new API version
 * @param {string} apiVersionId The id of the API version to update
 * @returns {string} The HTTP response in number format (200, 400, etc.)
 */
async function updateApiVersion (specPath: string, apiVersionId: string): Promise<number> {
  const graphqlUrl = core.getInput('GRAPHQL_URL', { required: true })
  const query = `
        mutation updateApisFromRapidOas($updates: [ApiUpdateFromRapidOasInput!]!) {
        updateApisFromRapidOas(updates: $updates) {
            apiId
        }
    }`

  const variables = {
    updates: {
      spec: null,
      apiVersionId
    }
  }

  const updatesFile = fs.readFileSync(specPath)

  const fd = new FormData()
  fd.append('operations', JSON.stringify({ query, variables }))
  fd.append('map', '{"0":["variables.updates.spec"]}')
  fd.append('0', updatesFile, {
    filename: 'spec.json',
    contentType: 'application/json'
  })

  const options = {
    method: 'POST',
    url: graphqlUrl,
    headers: Object.assign(formGraphqlHeaders(), fd.getHeaders()),
    data: fd
  }

  const res = await axios.request(options)
  if (res.status === 200 && res.data.errors === undefined) {
    return res.status as number
  } else if (
    res.status === 200 &&
        res.data.errors !== undefined &&
        typeof res.data.errors === 'object'
  ) {
    // this happens when an unknown collection is part of the spec; we get a 200, but
    // also an unprocessable_entity error :/
    const errorMessage: string[] = []
    res.data.errors.forEach((value: { message: string }) => errorMessage.push(value.message))
    throw new SpecParsingError(`Error parsing spec: ${errorMessage.toString()}`)
  } else {
    throw new UnexpectedStatusError(
            `HTTP status is not 200, but ${res.status}`
    )
  }
}

export { updateApiVersion }

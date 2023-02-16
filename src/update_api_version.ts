import axios from 'axios'
import * as fs from 'fs'
import FormData = require('form-data')
import * as core from '@actions/core'
import { formGraphqlHeaders } from '../src/headers'
import { SpecParsingError, UnexpectedStatusError } from '../src/errors'

/**
 * Creates and returns a new API version for a given API
 * @param {*} version_name Version name or number for the new API version
 * @param {*} api_id The id of the API to create a new version for
 * @param {object} client The GraphQL Client object for reuse
 * @returns {string} The id of the newly created API version
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
import axios from 'axios'
import * as fs from 'fs'
import FormData = require('form-data')
import * as core from '@actions/core'
import { formGraphqlHeaders } from './headers'
import { SpecParsingError, UnexpectedStatusError } from './errors'
import { apiVersion } from './types'

/**
*  Updates an existing API version with the contents of the provided spec file <br/>
*  Return a boolean true if the update succeeded or throw an error if not
 * @param {string} specPath Version name or number for the new API version
 * @param {apiVersion} apiVersion The API version object to update
 * @returns {Promise<boolean>} A truthy boolean if the update succeeded
 */
export async function updateApiVersion(specPath: string, apiVersion: apiVersion): Promise<boolean> {
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
      apiVersionId: apiVersion.id
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
    return true
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

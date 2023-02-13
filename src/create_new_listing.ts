import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import * as core from '@actions/core'
import { PlatformAPIError, UnexpectedStatusError } from './errors.js'
import { formGraphqlHeaders } from './headers.js'

/**
 * Creates a new API listing on the RapidAPI (Enterprise) Hub
 *
 * @param {string} filename Filename of the OAS to be uploaded
 * @return {string} The id of the newly created API
 */
async function createNewListing (specPath) {
  const graphqlUrl = core.getInput('GRAPHQL_URL', { required: true })

  const query = `
    mutation createApisFromRapidOas($creations: [ApiCreateFromRapidOasInput!]!) {
        createApisFromRapidOas(creations: $creations) {
        apiId
        
        }
    }`

  const variables = {
    creations: {
      spec: null
    }
  }

  const creationsFile = fs.readFileSync(specPath)

  const fd = new FormData()
  fd.append('operations', JSON.stringify({ query, variables }))
  fd.append('map', '{"0":["variables.creations.spec"]}')
  fd.append('0', creationsFile, {
    filename: 'spec.json',
    contentType: 'application/json'
  })

  const options = {
    method: 'POST',
    url: graphqlUrl,
    headers: Object.assign(formGraphqlHeaders(), fd.getHeaders()),
    data: fd
  }

  try {
    const res = await axios.request(options)
    if (res.status === 200) {
      return res.data.data.createApisFromRapidOas[0].apiId
    } else {
      throw new UnexpectedStatusError(
                `HTTP status is not 201, but ${res.status}`
      )
    }
  } catch (err) {
    throw new PlatformAPIError(`Platform API error: ${err}`)
  }
}

export { createNewListing }

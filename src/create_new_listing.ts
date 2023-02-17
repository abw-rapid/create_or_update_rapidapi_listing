import axios from 'axios'
import FormData = require('form-data')
import * as fs from 'fs'
import * as core from '@actions/core'
import { UnexpectedResponseError } from './errors'
import { formGraphqlHeaders } from './headers'

/**
 * Creates a new API listing on the RapidAPI (Enterprise) Hub
 *
 * @param {string} specPath Filename of the OAS to be uploaded
 * @return {string} The id of the newly created API
 */
async function createNewListing (specPath: string): Promise<string> {
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

  const creationsFile = fs.readFileSync(specPath, 'utf-8')

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
    return res.data.data.createApisFromRapidOas[0].apiId
  } catch (e) {
    console.log(e.response.error)
    throw new UnexpectedResponseError('Unknown error in create_new_listing')
  }
}

export { createNewListing }

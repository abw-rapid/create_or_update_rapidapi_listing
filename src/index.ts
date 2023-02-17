#!/usr/bin/env node
import { alreadyExists } from './already_exists'
import { apiVersionFromSpec, apiNameFromSpec } from './parse_spec'
import { createApiVersion } from './create_api_version'
import { createNewListing } from './create_new_listing'
import { getCurrentApiVersion } from './get_current_api_version'
import { graphqlHeaders } from './headers'
import { readSpec } from './read_spec'
import { updateApiVersion } from './update_api_version'
import dotenv from 'dotenv'
import * as core from '@actions/core'
import * as g from 'graphql-request'
import semver from 'semver'

dotenv.config()

async function main (): Promise<void> {
  const specPath = core.getInput('SPEC_PATH', { required: true })
  const graphqlUrl = core.getInput('GRAPHQL_URL', { required: true })
  const ownerId = core.getInput('OWNER_ID', { required: true })

  // We're making two to three API calls to the GraphQL PAPI with the same headers, so
  // let's re-use a single client object
  const client = new g.GraphQLClient(graphqlUrl, {
    headers: Object.assign(graphqlHeaders())
  })

  const spec = readSpec(specPath)
  const name = apiNameFromSpec(spec)
  const apiId = await alreadyExists(name, parseInt(ownerId), client)
  if (apiId !== '__not_found__') {
    // Provide some data about the API
    const currentVersion = await getCurrentApiVersion(apiId, client)
    const parsedCurrentVersion = currentVersion.name
    const parsedSpecVersion = apiVersionFromSpec(spec)
    console.log('=> This is an existing API')
    console.log(`  The API id is: ${apiId}`)
    console.log(`  Version on Hub: ${parsedCurrentVersion.version}`)
    console.log(`  Version in spec: ${parsedSpecVersion.version}`)

    // Only create a new API version if the provided spec's version is higher than
    // the version already on the Hub
    const specIsNewer = semver.gt(
      parsedSpecVersion,
      parsedCurrentVersion
    )
    console.log('=> Uploaded spec is newer: ' + String(specIsNewer))

    if (specIsNewer) {
      console.log('   Creating new API version in Hub...')
      const newVersionId = await createApiVersion(
        parsedSpecVersion.version,
        apiId,
        client
      )
      console.log('   => New version id: ' + newVersionId)
      await updateApiVersion(specPath, newVersionId)
      console.log('   Successfully uploaded new API version into the Hub!')

      // Set output variables for re-use in later actions, if need be
      core.setOutput('api_id', apiId)
      core.setOutput('api_version_name', parsedSpecVersion)
      core.setOutput('api_version_id', newVersionId)
    } else {
      console.warn('   Spec version was not newer than version on Hub...')
      console.warn('   Not creating new version.')
    }
    core.setOutput('api_id', apiId)
  } else {
    console.log('=> This is a new API')
    const newApi = await createNewListing(specPath)
    const initialVersion = await getCurrentApiVersion(newApi, client)
    console.log('   New api id: ' + newApi)
    console.log('   Initial version id: ' + initialVersion.id)

    // Set output variables for re-use in later actions, if need be
    core.setOutput('api_id', newApi)
    core.setOutput('api_version_name', initialVersion.name)
    core.setOutput('api_version_id', initialVersion.id)
  }
}

main().catch((error) => {
  console.error(error)
})

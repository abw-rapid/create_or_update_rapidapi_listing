import * as toml from 'toml'
import * as fs from 'fs'
import * as core from '@actions/core'
import * as g from 'graphql-request'
import dotenv from 'dotenv'
import { graphqlHeaders } from './headers'
import { readSpec } from './read_spec'
import { getApiNameFromSpec, getApiVersionFromSpec } from './parse_spec'
import { getApiVersions } from './get_apiVersions'
import { alreadyExists } from './api_already_exists'
import { createNewListing } from './create_new_listing'
import { getCurrentApiVersion } from './get_current_api_version'
import { apiVersionExists } from './apiVersion_already_exists'
import { UpdatePolicyError } from './errors'
import { findClosest, findNewer, findOlder } from './findApiVersions'
import { getUpdateLevel } from './getUpdateLevel'
import { updateApiVersion } from './update_api_version'


(async function () {

    dotenv.config()

    let config
    try {
        config = toml.parse(fs.readFileSync('./rapidConfig.default.toml', 'utf-8'))
    } catch {
        throw new Error('Unable to open default configuration file rapidConfig.default.toml')
    }

    const specPath = core.getInput('SPEC_PATH', { required: true })
    const graphqlUrl = core.getInput('GRAPHQL_URL', { required: true })
    const ownerId = core.getInput('OWNER_ID', { required: true })

    // We're making two to three API calls to the GraphQL PAPI with the same headers, so
    // let's re-use a single client object
    const client = new g.GraphQLClient(graphqlUrl, {
        headers: Object.assign(graphqlHeaders())
    })

    const spec = readSpec(specPath)
    const apiNameFromSpec = getApiNameFromSpec(spec)
    const apiVersionFromSpec = getApiVersionFromSpec(spec)
    const api = await alreadyExists(apiNameFromSpec, parseInt(ownerId), client)

    if (Object.keys(api).length === 0) {
        /// This is a wholy new API, let's create it
        console.log("=> This is a new API, called: '", apiNameFromSpec, "'")
        console.log("==> Creating new listing on RapidAPI Hub...")
        const newApiId = await createNewListing(specPath)
        console.log('   New api id: ' + newApiId)
        const initialVersion = await getCurrentApiVersion(newApiId, client)
        console.log('   Initial version id: ' + initialVersion.id)
        // Set output variables for re-use in later actions, if need be
        core.setOutput('api_id', newApiId)
        core.setOutput('api_version_name', initialVersion.name)
        core.setOutput('api_version_id', initialVersion.id)
    } else {
        /// This is an existing API, let's inspect it
        console.log("=> This is an existing API, called: '", apiNameFromSpec + " '" +
            ", version", apiVersionFromSpec.version)
        const existingVersions = await getApiVersions(api.id, client)
        console.log(`==> The API ID on the Hub is ${api.id}`)
        console.log(`==> Found ${existingVersions.nodes.length} existing versions of this API`)
        const existingVersionList = existingVersions.nodes.map(v => v.name).sort().join(', ')
        console.log(`===> Found versions: ${existingVersionList}`)
        const existingApiVersion = apiVersionExists(existingVersions, apiVersionFromSpec)

        if (Object.keys(existingApiVersion).length > 0) {
            // This is an existing apiVersion.name, so we need to figure out whether we are allowed to
            // update this existing apiVersion with a new spec file
            console.log(`====> Found an existing apiVersion with the same name (${apiVersionFromSpec.version})`)
            if (config.general.allow_update_existing === true) {
                console.warn(" WARN: Updating existing apiVersion with new spec")
                const updatedApi = await updateApiVersion(specPath, existingApiVersion.id)
                console.log(`=====> Updated API ${updatedApi}, apiVersion ${existingApiVersion.id}` +
                    ` to version ${apiVersionFromSpec.version}`)
            } else {
                const message = "ERROR: Updating existing apiVersion with new spec not allow by config."
                throw new UpdatePolicyError(message)
            }
        } else {
            // This is a new apiVersion.name, so we can now move on to figuring out whether we push it into
            // an existing apiVersion, or create a new apiVersion for it
            // At this point, we know that the uploaded version doesn't exist on the Hub yet. In other words,
            // As we cannot have an API without any apiVersions on the Hub, we can expect to either find newer 
            // apiVersions, older apiVersions, or both.
            const newerApiVersions = findNewer(existingVersions, apiVersionFromSpec)
            const olderApiVersions = findOlder(existingVersions, apiVersionFromSpec)
            if (newerApiVersions.length === 0) {
                // The provided spec has a higher version number than any of the existing ones
                // in other words, it is the newest apiVersion we've ever seen!
                console.log("=====> No newer apiVersions found on the Hub")
                const closestOlder = findClosest(olderApiVersions, apiVersionFromSpec)
                console.log("=====> The closest, older version is: ", closestOlder)
                const semverUpdate = getUpdateLevel(closestOlder.name, null, apiVersionFromSpec)
                console.log(`=====> Compared to ${closestOlder.name.version}, this update is: ${semverUpdate}`)
                // TODO: implement update / create code
            } else {
                // apiVersions with newer versions exist, therefore, we need to compare to both the
                // closest older and closest newer apiVersion to determine wether this is a patch
                // a minor or a major version update
                console.log('=====> Uploaded apiVersion is older than the following apiVersion(s):')
                console.log('=====> ', newerApiVersions.map(v => v.name).sort().join(', '))
                const closestNewer = findClosest(newerApiVersions, apiVersionFromSpec)
                const closestOlder = findClosest(olderApiVersions, apiVersionFromSpec)
                console.log("======> Closest newer version: ", closestNewer.name)
                console.log("======> Closest older version: ", closestOlder.name)
                const semverUpdate = getUpdateLevel(closestOlder.name, closestNewer.name, apiVersionFromSpec)
                console.log(`=====> Compared to ${closestOlder.name.version} and ${closestNewer.name.version}` +
                    `, this update is: ${semverUpdate}`)
                // TODO: implement update / create code
            }

            // we know the new version
            // we know the updateLevel
            // we know the policy -> can fetch from config based on updateLevel
            // we know wheter to set the new api as current
            // we know whether to update or create
            // we know whether to allow older

            // we know the closest, older version to update, if that's what we want

            // call updateFunction[updateLevel]






        }




    }



})()
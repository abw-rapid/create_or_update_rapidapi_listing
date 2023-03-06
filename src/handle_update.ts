import * as core from '@actions/core'
import { api, apiPolicy, apiVersion, updateEnum, updateMethod } from './types'
import { readSpec } from './read_spec'
import { createApiVersion } from './create_api_version'
import { getApiVersionFromSpec } from './parse_spec'
import { GraphQLClient } from 'graphql-request'
import { updateApiVersion } from './update_api_version'
import { setApiCurrent, setApiStatus } from './set_created_version_as_current'
import { readConfig } from './read_config'

/**
 * Build an apiPolicy object that we can use below to perform the update or create action for a (new) apiVersion </br>
 * 
 * @param {string} updateLevel "major", "minor" or "patch": defines what kind of update we are handling
 * @param {api} existingApi we store the API ID in the apiPolicy object to make calls to 
 * the GraphQL easier later on; there is always an existin API at this point
 * @param {boolean} isOlder boolean to indicate whether or not this apiVersion has a lower version number 
 * than some existing apiVersion objects
 * @param {apiVersion} closestOlder apiVersion object containing the closest API version, or undefined; 
 * if this is undefined, we are in the corner case where we are creating an apiVersion that is older 
 * than all of the existing ones...
 * @return {apiPolicy} An apiPolicy object containing information on how to handle the new apiVersion
 */
export function getUpdatePolicy(updateLevel: string, existingApi: api, isOlder: boolean, closestOlder: apiVersion | undefined): apiPolicy {
    const config = readConfig()
    console.log('')
    console.log('==> We are handling update at level: ', updateLevel)
    console.log('==> Relevant policy:')

    const policy: apiPolicy = {} as apiPolicy
    const configPolicy = config[updateLevel]
    if (closestOlder === undefined && configPolicy.update_policy === "update") {
        console.log('===> Update policy: create')
        console.warn('====> Update policy is "update", but overriding to "create" as no older versions exist.')
        policy.method = updateMethod['create']
    } else {
        console.log(`===> Update policy: ${configPolicy.update_policy as string}`)
        policy.method = configPolicy.update_policy as updateMethod
    }

    console.log(`===> Allow older: ${configPolicy.allow_older as string}`)
    console.log(`===> Set new as current: ${configPolicy.auto_current as string}`)
    console.log(`===> Create as: ${config.general.create_as as string}`)
    policy.setCurrent = configPolicy.auto_current
    policy.createAs = config.general.create_as
    policy.updateType = updateLevel as updateEnum
    policy.api = existingApi.id
    if (isOlder === true && configPolicy.allow_older === false) {
        policy.method = updateMethod['forbidden']
    }
    return policy
}

/**
 * Handle the actual updating or creation of an apiVersion
 * 
 * @param {apiPolicy} policy The apiPolicy object defining how to handle this apiVersion
 * @param {string} specPath string containing the location of the OpenAPI spec file
 * @param {apiVersion|null} toBeUpdated Either an apiVersion that we'll push a new spec into, or undefined
 * @param {GraphQLClient} client The GraphQL Client object for reuse
 * @return {Promise<boolean>} An apiPolicy object containing information on how to handle the new apiVersion
 */
export async function handleUpdate(policy: apiPolicy, specPath: string, toBeUpdated: apiVersion | null, c: GraphQLClient): Promise<boolean> {
    const spec = readSpec(specPath)
    const parsedSpecVersion = getApiVersionFromSpec(spec)
    let outputApiVersion
    console.log('')

    switch (policy.method as updateMethod) {
        case updateMethod.forbidden: {
            console.error(`====> Your policy forbids the currently suggested ${policy.updateType} update.`)
            return false
        }
        case updateMethod.create: {
            console.log('====> Creating new API version in Hub...')
            const newVersionId = await createApiVersion(parsedSpecVersion, policy.api, c)
            outputApiVersion = newVersionId.id
            console.log('=====> New version id: ' + newVersionId.id)
            if (await updateApiVersion(specPath, newVersionId)) {
                console.log(`=====> Successfully uploaded new API version into the Hub as ${parsedSpecVersion}`)
            } else {
                console.log('=====> Error uploading new API version into the Hub')
                return false
            }
            if (policy.setCurrent == true) {
                console.log("======> Setting newly created version as current...")
                if (await setApiCurrent(newVersionId, c)) {
                    console.log("======> Success!")
                } else {
                    console.error("======> Problem settings newly created version as current.")
                    return false
                }
            } else {
                console.log(`======> Setting newly created version as ${policy.createAs}...`)
                if (await setApiStatus(newVersionId, policy.createAs, c)) {
                    console.log("======> Success!")
                } else {
                    console.error(`======> Problem settings newly created version as ${policy.createAs}.`)
                    return false
                }
            }
            break
        }
        case updateMethod.update: {
            if (toBeUpdated) {
                console.log(`====> Updating existing API version ${toBeUpdated.id} in Hub...`)
                outputApiVersion = toBeUpdated.id
                if (await updateApiVersion(specPath, toBeUpdated)) {
                    console.log(`=====> Successfully updated API version in the Hub to ${parsedSpecVersion}`)
                } else {
                    console.log('=====> Error updating API version in the Hub')
                    return false
                }
            } else {
                console.error("This is a bug: you need to pass toBeUpdatedVersion if policy is 'update'")
            }
            break
        }
    }
    core.setOutput('api_id', policy.api)
    core.setOutput('api_version_name', parsedSpecVersion)
    core.setOutput('api_version_id', outputApiVersion)
    return true
}

import * as toml from 'toml'
import * as fs from 'fs'
import { api, apiPolicy, apiVersion, updateEnum, updateMethod } from './types'
import { readSpec } from './read_spec'
import { createApiVersion } from './create_api_version'
import { getApiVersionFromSpec } from './parse_spec'
import { GraphQLClient } from 'graphql-request'
import { updateApiVersion } from './update_api_version'
import { setApiCurrent, setApiStatus } from './set_created_version_as_current'

export function getUpdatePolicy(updateLevel: string, existingApi: api, isOlder: boolean): apiPolicy {
    let config
    const policy: apiPolicy = {} as apiPolicy
    try {
        config = toml.parse(fs.readFileSync('./rapidConfig.default.toml', 'utf-8'))
    } catch {
        throw new Error('Unable to open default configuration file rapidConfig.default.toml')
    }
    console.log('')
    console.log('==> We are handling update at level: ', updateLevel)
    console.log('==> Relevant policy:')
    console.log(`===> Allow older: ${config.allow_older[updateLevel] as string}`)
    console.log(`===> Update policy: ${config.update_policy[updateLevel] as string}`)
    console.log(`===> Set new as current: ${config.auto_current[updateLevel] as string}`)
    console.log(`===> Create as: ${config.general.create_as as string}`)
    policy.method = config.update_policy[updateLevel] as updateMethod
    policy.setCurrent = config.auto_current[updateLevel]
    policy.createAs = config.general.create_as
    policy.updateType = updateLevel as updateEnum
    policy.api = existingApi.id
    if (isOlder === true && config.allow_older[updateLevel] === false) {
        policy.method = updateMethod['forbidden']
    }
    return policy
}

export async function handleUpdate(policy: apiPolicy, specPath: string, toBeUpdated: apiVersion | null, c: GraphQLClient): Promise<boolean> {
    const spec = readSpec(specPath)
    const parsedSpecVersion = getApiVersionFromSpec(spec)
    console.log('')

    switch (policy.method as updateMethod) {
        case updateMethod.forbidden: {
            console.error(`====> Your policy forbids the currently suggested ${policy.updateType} update.`)
            return false
        }
        case updateMethod.create: {
            console.log('====> Creating new API version in Hub...')
            const newVersionId = await createApiVersion(parsedSpecVersion, policy.api, c)
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
    return true
}

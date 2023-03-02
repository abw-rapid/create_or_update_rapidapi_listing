import * as toml from 'toml'
import * as fs from 'fs'
import { apiPolicy, updateMethod } from './types'

export function handleUpdate(updateLevel: string, isOlder: boolean): apiPolicy {
    let config
    const policy: apiPolicy = {} as apiPolicy
    try {
        config = toml.parse(fs.readFileSync('./rapidConfig.default.toml', 'utf-8'))
    } catch {
        throw new Error('Unable to open default configuration file rapidConfig.default.toml')
    }
    console.log("")
    console.log("==> We are handling update at level: ", updateLevel)
    console.log(`==> Relevant policy ${updateLevel}: `)
    console.log(`===> Allow older: ${config.allow_older[updateLevel] as string}`)
    console.log(`===> Update policy: ${config.update_policy[updateLevel] as string}`)
    console.log(`===> Set new as current: ${config.auto_current[updateLevel] as string}`)
    policy.method = config.update_policy[updateLevel] as updateMethod
    policy.setCurrent = config.auto_current[updateLevel]
    policy.createAs = config.general.create_as
    if (isOlder === true && config.allow_older[updateLevel] === false) {
        policy.method = updateMethod["forbidden"]
    }
    return policy
}


import * as toml from 'toml'
import * as fs from 'fs'
import * as core from '@actions/core'
import { apiVersion } from './types'

export function handleUpdate(updateLevel: string, closest: apiVersion, spec: string) {
    let config
    try {
        config = toml.parse(fs.readFileSync('./rapidConfig.default.toml', 'utf-8'))
    } catch {
        throw new Error('Unable to open default configuration file rapidConfig.default.toml')
    }
    console.log("")
    console.log("==> We are handling update at level: ", updateLevel)
    console.log(`==> Relevant policy ${updateLevel}: `)
    console.log(`===> Update policy: ${config.update_policy[updateLevel] as string}`)
    console.log(`===> Allow older: ${config.allow_older[updateLevel] as string}`)
    console.log(`===> Set new as current: ${config.auto_current[updateLevel] as string}`)


}


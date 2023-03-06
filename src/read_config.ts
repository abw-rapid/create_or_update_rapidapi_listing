import * as toml from 'toml'
import * as fs from 'fs'

const default_config = `
[general]
create_as = "active"
allow_update_existing = false
allow_update_deprecated = true

[major]
update_policy = "create"
allow_older = true
auto_current = false

[minor]
update_policy = "update"
allow_older = true
auto_current = false

[patch]
update_policy = "update"
allow_older = true
auto_current = false
`

/** Read the branch specific rapidConfig.$branch.config configuration file,
 * or the default rapidConfig.default.config if that doesn't exist.
 * Throw error if no configuration file can be found / read into toml.
 * @return {string} An object containing the (branch specific) configuration
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readConfig(): any {
    let config
    try {
        let branch = ""
        if (process.env.GITHUB_REF_NAME !== undefined) {
            branch = process.env.GITHUB_REF_NAME
        }
        config = toml.parse(fs.readFileSync(`rapidConfig.${branch}.toml`, 'utf-8'))
        console.log(`Using configuration file rapidConfig.${branch}.toml`)
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.warn('No branch specific configuration file found. Trying default.')
            try {
                config = toml.parse(fs.readFileSync('rapidConfig.default.toml', 'utf-8'))
                console.log('Using default configuration file rapidConfig.default.toml...')
            } catch (e) {
                if (e.name === 'SyntaxError') {
                    throw new SyntaxError('Syntax error encountered while trying to read configuration file. ' +
                        'Please check your rapidConfig file(s)')
                } else {
                    config = toml.parse(default_config)
                    console.warn('No default configuration file found, using built-in defaults.')
                }
            }
        } else if (e.name === 'SyntaxError') {
            throw new SyntaxError('Syntax error encountered while trying to read configuration file. ' +
                'Please check your rapidConfig file(s)')
        } else {
            throw new Error('Unknown problem trying to read configuration file. ' +
                'Please check your rapidConfig file(s)')
        }
    }
    return config
}
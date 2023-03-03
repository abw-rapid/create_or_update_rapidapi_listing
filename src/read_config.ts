import * as toml from 'toml'
import * as fs from 'fs'

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
        config = toml.parse(fs.readFileSync(`./rapidConfig.${branch}.toml`, 'utf-8'))
        console.log(`Using configuration file rapidConfig.${branch}.toml`)
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.warn('No branch specific configuration file found. Trying default.')
            try {
                config = toml.parse(fs.readFileSync('./rapidConfig.default.toml', 'utf-8'))
            } catch (e) {
                throw new Error('Unable to open or parse default configuration ' +
                    'file rapidConfig.default.toml. Please check your rapidConfig file(s)')
            }
        } else {
            throw new Error('Unknown problem trying to read configuration file.' +
                'Please check your rapidConfig file(s)')
        }
    }
    return config
}
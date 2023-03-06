import * as fs from 'fs'
import { readConfig } from '../src/read_config'

const branch_specific_contents = `
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
auto_current = true
`

const broken_toml = `
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
auto_current = tru # this line is broken!
`

const expected_default_json = `
    {
        "general":{
           "allow_update_deprecated":true,
           "allow_update_existing":false,
           "create_as":"active"
        },
        "major":{
           "allow_older":true,
           "auto_current":false,
           "update_policy":"create"
        },
        "minor":{
           "allow_older":true,
           "auto_current":false,
           "update_policy":"update"
        },
        "patch":{
           "allow_older":true,
           "auto_current":false,
           "update_policy":"update"
        }
     }
`

const branch_specific_json = `
    {
        "general":{
           "allow_update_deprecated":true,
           "allow_update_existing":false,
           "create_as":"active"
        },
        "major":{
           "allow_older":true,
           "auto_current":false,
           "update_policy":"create"
        },
        "minor":{
           "allow_older":true,
           "auto_current":false,
           "update_policy":"update"
        },
        "patch":{
           "allow_older":true,
           "auto_current":true,
           "update_policy":"update"
        }
     }
`

afterEach(() => {
   jest.restoreAllMocks()
})

test('return default configuration in apiPolicy object', () => {
   expect(readConfig()).toEqual(JSON.parse(expected_default_json))
})

test('read branch specific configuration file into apiPolicy object', () => {
   process.env.GITHUB_REF_NAME = "something"
   jest.spyOn(fs, 'readFileSync')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation(((filename: string) => branch_specific_contents) as typeof fs.readFileSync)
   expect(readConfig()).toEqual(JSON.parse(branch_specific_json))
})

test('broken config throws SyntaxError', () => {
   process.env.GITHUB_REF_NAME = "something"
   jest.spyOn(fs, 'readFileSync')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation(((filename: string) => broken_toml) as typeof fs.readFileSync)
   expect(() => readConfig()).toThrow(SyntaxError)
})

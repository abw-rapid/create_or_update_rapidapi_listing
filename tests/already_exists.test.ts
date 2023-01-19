import { expect, jest, test } from '@jest/globals'
import { alreadyExists } from '../src/already_exists'
import * as g from 'graphql-request'
import { env } from 'process'

const returnDataOne = `{
    "apis": {
        "nodes": [
            {
                "id": "the_id_we_are_looking_for"
            }
        ]
    }
}`

const returnIdOne = 'the_id_we_are_looking_for'

jest.mock('graphql-request')

afterEach(() => {
  jest.restoreAllMocks()
})

test('When we check the gPAPI for existing APIs and get single return', async () => {
  if (env.INPUT_GRAPHQL_URL === undefined) {
    fail('The environment variable INPUT_GRAPHQL_URL is not set.')
  }
  const c = new g.GraphQLClient(env.INPUT_GRAPHQL_URL)
  const mockRequest = c.request as jest.MockedFunction<typeof c.request>
  mockRequest.mockImplementation(() => {
    return JSON.parse(returnDataOne)
  })
  const res = await alreadyExists('My API', 12345678, c)
  expect(res).toEqual(returnIdOne)
})

const result = [
  [
    '\n    query api($where: ApiWhereInput) {\n        apis(where: $where) {\n          nodes {\n            id\n            name\n          }\n        }\n      }',
    { where: { name: 'My API', ownerId: 12345678 } }
  ]
]

test('When we check the gPAPI for existing APIs and get single return', async () => {
  if (env.INPUT_GRAPHQL_URL === undefined) {
    fail('The environmet variable INPUT_GRAPHQL_URL is not set.')
  }
  const c = new g.GraphQLClient(env.INPUT_GRAPHQL_URL)
  const mockRequest = c.request as jest.MockedFunction<typeof c.request>
  mockRequest.mockImplementation(() => {
    return JSON.parse(returnDataOne)
  })
  await alreadyExists('My API', 12345678, c)
  expect(mockRequest.mock.calls).toEqual(result)
})

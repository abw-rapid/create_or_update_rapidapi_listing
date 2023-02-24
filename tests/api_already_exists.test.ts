import * as g from 'graphql-request'
import { env } from 'process'
import { MultipleAPIsFoundError } from '../src/errors'
import { alreadyExists } from '../src/api_already_exists'
import { api } from 'src/types'

const oneApiList = `{
    "apis": {
        "nodes": [
            {
                "id": "the_id_we_are_looking_for",
                "name": "the name of this API"
            }
        ]
    }
}`

// having the gPAPI return us two values should break things
const twoApiList = `{
    "apis": {
        "nodes": [
            {
                "id": "the_id_we_are_looking_for",
                "name": "the name of this API"
            },
            {
                "id": "the_id_we_are_not_looking_for",
                "name": "the name of this API"
            }
        ]
    }
}`

const returnIdOne: api= {
  "id": "the_id_we_are_looking_for",
  "name": "the name of this API"
}

jest.mock('graphql-request')

afterEach(() => {
  jest.restoreAllMocks()
})

test('test selecting the right api from a list with a single api', async () => {
  if (env.INPUT_GRAPHQL_URL === undefined) {
    fail('The environment variable INPUT_GRAPHQL_URL is not set.')
  }
  const c = new g.GraphQLClient(env.INPUT_GRAPHQL_URL)
  const mockRequest = c.request as jest.MockedFunction<typeof c.request>
  mockRequest.mockImplementation(() => {
    return JSON.parse(oneApiList)
  })
  const res: api = await alreadyExists('My API', 12345678, c)
  expect(res).toEqual(returnIdOne)
})

test('test throwing when presented with a list with a two apis', async () => {
  if (env.INPUT_GRAPHQL_URL === undefined) {
    fail('The environment variable INPUT_GRAPHQL_URL is not set.')
  }
  const c = new g.GraphQLClient(env.INPUT_GRAPHQL_URL)
  const mockRequest = c.request as jest.MockedFunction<typeof c.request>
  mockRequest.mockImplementation(() => {
    return JSON.parse(twoApiList)
  })
  expect(async() => { await alreadyExists('My API', 12345678, c) })
    .rejects
    .toThrow(MultipleAPIsFoundError)
})

const formattedQuery = [
  [
    '\n    query api($where: ApiWhereInput) {\n        apis(where: $where) {\n          nodes {\n            id\n            name\n          }\n        }\n      }',
    { where: { name: 'My API', ownerId: 12345678 } }
  ]
]

test('test formatting of graphql query for existing api', async () => {
  if (env.INPUT_GRAPHQL_URL === undefined) {
    fail('The environmet variable INPUT_GRAPHQL_URL is not set.')
  }
  const c = new g.GraphQLClient(env.INPUT_GRAPHQL_URL)
  const mockRequest = c.request as jest.MockedFunction<typeof c.request>
  mockRequest.mockImplementation(() => {
    return JSON.parse(oneApiList)
  })
  await alreadyExists('My API', 12345678, c)
  expect(mockRequest.mock.calls).toEqual(formattedQuery)
})

import { getCurrentApiVersion } from '../src/get_current_api_version'
import { env } from 'process'
import * as g from 'graphql-request'

jest.mock('graphql-request')

afterEach(() => {
  jest.restoreAllMocks()
})

const versionList = JSON.parse(`
{ 
    "apiVersions": {
        "nodes": [
            {
                "id": "apiversion_a6ee5ca5-3bca-47b0-95a6-ba02c06fbddb",
                "api": "api_8ef57cc9-aca9-427d-b643-7d9eec7b5712",
                "current": true,
                "name": "0.4.3",
                "status": "ACTIVE",
                "versionStatus": "active"
            },
            {
                "id": "apiversion_a6ee5ca5-3bca-47b0-95a6-zzzzzzzzzzzz",
                "api": "api_8ef57cc9-aca9-427d-b643-7d9eec7b5712",
                "current": false,
                "name": "0.4.2",
                "status": "ACTIVE",
                "versionStatus": "active"
            }
        ]
    }
}`)

const result = [
  [
    '\n    query apiVersions($where: ApiVersionWhereInput) {\n        apiVersions(where: $where) {\n          nodes {\n            id\n            name\n            current\n          }\n        }\n      }',
    {
      where: {
        apiId: 'api_8ef57cc9-aca9-427d-b643-7d9eec7b5712',
        versionStatus: 'ACTIVE'
      }
    }
  ]
]

test('test formatting of graphql query for current version', async () => {
  if (env.INPUT_GRAPHQL_URL === undefined) {
    fail('The environment variable INPUT_GRAPHQL_URL is not set.')
  }

  type mockRequestSpy = (
    document: g.RequestDocument,
    variables: g.Variables
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>

  const c = new g.GraphQLClient(env.INPUT_GRAPHQL_URL)
  const mockRequest = c.request as unknown as jest.MockedFunction<mockRequestSpy>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mockRequest.mockImplementation(async (document: g.RequestDocument, variables: g.Variables) => {
    return versionList
  })
  await getCurrentApiVersion(
    'api_8ef57cc9-aca9-427d-b643-7d9eec7b5712',
    c
  )
  expect(mockRequest.mock.calls).toEqual(result)
})

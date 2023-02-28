import { createApiVersion } from '../src/create_api_version'
import { apiVersion, apiVersionStatus } from '../src/types'
import nock = require('nock')
import * as graphql from 'graphql-request'

afterEach(() => {
  jest.restoreAllMocks()
})

const res = {
  data: {
    createApiVersions: [
      {
        id: 'the_id_we_are_looking_for',
        name: '1.0.0',
        current: false,
        api: 'api_id',
        versionStatus: 'ACTIVE'
      }
    ]
  }
}

const expectedResponse: apiVersion = {
        id: 'the_id_we_are_looking_for',
        name: '1.0.0',
        current: false,
        api: 'api_id',
        versionStatus: apiVersionStatus.active
}

test('handling create_api_version reponse', async () => {
  // nock.recorder.rec()
  const c = new graphql.GraphQLClient(
    'https://platform-graphql.p.rapidapi.com'
  )
  nock('https://platform-graphql.p.rapidapi.com').post('/').reply(200, res)
  expect(await createApiVersion('1.0.0', 'api_id', c)).toEqual(expectedResponse)
})

export {}

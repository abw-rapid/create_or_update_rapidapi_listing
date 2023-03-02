import { updateApiVersion } from '../src/update_api_version'
import nock = require('nock')
import * as fs from 'fs'
import { apiVersion } from '../src/types'

afterEach(() => {
  jest.restoreAllMocks()
})

const contents = JSON.stringify({
  openapi: '3.0.0',
  servers: [
    {
      url: 'https://my_gateway.com'
    }
  ]
})

const res = {
  updateApisFromRapidOas: {
    apiId: 'the_id_we_are_looking_for'
  }
}

const testVersion: apiVersion = {
  id: 'api_version_id',
  name: 'api_version_name'
}

test('handling update_api_version reponse', async () => {
  const mockRead = jest
    .spyOn(fs, 'readFileSync')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .mockImplementation((filename) => contents)
  nock('https://platform-graphql.p.rapidapi.com').post('/').reply(200, res)
  expect(
    await updateApiVersion(
      '/home/someuser/test_spec.json',
      testVersion
    )
  ).toBeTruthy
  mockRead.mockRestore()
})

export { }

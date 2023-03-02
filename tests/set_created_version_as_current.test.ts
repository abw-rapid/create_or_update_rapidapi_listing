import { setApiCurrent } from '../src/set_created_version_as_current'
import * as g from 'graphql-request'
import nock = require('nock')
import { apiVersion } from 'src/types'

const res = {
  data: {
    updateApiVersion: [
      {
        id: 'testVersionId'
      }
    ]
  }
}

const testVersion: apiVersion = {
  id: 'api_version_id',
  name: 'api_version_name'
}

test('handling set_created_version_as_active reponse', async () => {
  const c = new g.GraphQLClient(
    'https://platform-graphql.p.rapidapi.com'
  )
  nock('https://platform-graphql.p.rapidapi.com').post('/').reply(200, res)
  expect(
    await setApiCurrent(testVersion, c)
  ).toBeTruthy()
})

export { }

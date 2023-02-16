import { setCreatedVersionAsActive } from '../src/set_created_version_as_active'
import * as g from 'graphql-request'
import nock = require('nock')

const res = {
  data: {
    updateApiVersion: [
      {
        id: 'testVersionId'
      }
    ]
  }
}

test('handling set_created_version_as_active reponse', async () => {
  const c = new g.GraphQLClient(
    'https://platform-graphql.p.rapidapi.com'
  )
  nock('https://platform-graphql.p.rapidapi.com').post('/').reply(200, res)
  expect(
    await setCreatedVersionAsActive('api_version_id', c)
  ).toBeTruthy()
})

export {}

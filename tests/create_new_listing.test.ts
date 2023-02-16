import { createNewListing } from '../src/create_new_listing'
import nock = require('nock')
import * as fs from 'fs'

const contents = JSON.stringify({
  openapi: '3.0.0',
  servers: [
    {
      url: 'https://my_gateway.com'
    }
  ]
})

const res = 'testId'

test('handling create_new_listing reponse', async () => {
  const mockRead = jest
    .spyOn(fs, 'readFileSync')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .mockImplementation(((filename: string) => contents) as typeof fs.readFileSync)
  nock('https://platform-graphql.p.rapidapi.com')
    .post('/')
    .reply(200, {
      data: {
        createApisFromRapidOas: [
          {
            apiId: 'testId',
            trackingId: 'testTrackingId',
            warnings: []
          }
        ]
      }
    })
  expect(await createNewListing('/home/someuser/test_spec.json')).toEqual(
    res
  )
  mockRead.mockRestore()
})

export {}

import * as core from '@actions/core'

export function formGraphqlHeaders(): object {
  const xRapidapiKey = core.getInput('X_RAPIDAPI_KEY', { required: true })
  const xRapidapiIdentityKey = core.getInput('X_RAPIDAPI_IDENTITY_KEY', { required: false })
  const xRapidapiGraphqlHost = core.getInput('X_RAPIDAPI_GRAPHQL_HOST', {
    required: true
  })

  return {
    'content-type': 'multipart/form-data',
    'x-rapidapi-key': xRapidapiKey,
    'x-rapidapi-identity-key': xRapidapiIdentityKey,
    'x-rapidapi-host': xRapidapiGraphqlHost
  }
}

export function graphqlHeaders(): object {
  const xRapidapiKey = core.getInput('X_RAPIDAPI_KEY', { required: true })
  const xRapidapiIdentityKey = core.getInput('X_RAPIDAPI_IDENTITY_KEY', { required: false })
  const xRapidapiGraphqlHost = core.getInput('X_RAPIDAPI_GRAPHQL_HOST', {
    required: true
  })

  return {
    'content-type': 'application/json',
    'x-rapidapi-key': xRapidapiKey,
    'x-rapidapi-identity-key': xRapidapiIdentityKey,
    'x-rapidapi-host': xRapidapiGraphqlHost
  }
}

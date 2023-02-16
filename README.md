# Create or update an API listing on RapidAPI Hub

This is a preview release of a GitHub action designed to make it easy to onboard
new APIs onto RapidAPI Hub or Enterprise Hub, or create new versions of existing
APIs. It uses the RapidAPI Platform API to upload an OpenAPI spec file and
returns the ID of the new API, as well as the name and ID of the newly created
API version.

## Usage

The action needs an OpenAPI v3.0 spec file in JSON format to exist in the repo. The
name of this file (or path to it, if it is in a subdirectory), needs to be fed to
the action by setting the `spec_path` environment variable.

The action takes the `info.title` field from the provided OpenAPI spec file as the name
of the API. It will then search for an existing API listing on the Hub that is owned by
the entity with `owner_id` as its ID (see below at [Inputs](#inputs) for mandatory
variables).

If an existing API listing with the same name can be found, it will be updated, provided
the version in `info.version` in the OpenAPI spec file is semantically higher than the
version number of the API listing on the Hub.

If an existing API with the same name cannot be found, a new API listing will be
created. The new API listing will be owned by the owner of the `x-rapidapi-key`.

### Requirements

If you are a RapidAPI Enterprise Hub user, you need the preview of the GraphQL Platform
API enabled in your Hub. You will need credentials (the `x-rapidapi-key` and
`x-rapidapi-host` headers) of a user or team that is enabled to use this API, as well as
their owner ID.

Note: if the used `x-rapidapi-key` is owned by a team, you also need to provide
an `x-rapidapi-identity-key`, which needs to be owned by an **individual user**.

### Example workflow

```yaml
name: My API Workflow
on: push
jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@master
            - name: Upload OAS to RapidAPI Hub for processing
              uses: maxim-rapidapi/create_or_update_rapidapi_listing@v0
              with:
                  spec_path: openapi.json
                  owner_id: 12345678
                  graphql_url: https://platform-graphql.p.rapidapi.com/
                  x_rapidapi_key: a-very-long-api-key
                  x_rapidapi_key: another-very-long-api-key
                  x_rapidapi_graphql_host: platform-graphql.yourhub.rapidapi.com
```

Usually, you would set those variables (`owner_id` etc.) as Action secrets for your
repo. In that case, you would refer to them as e.g. `${{ secrets.OWNER_ID }}`, assuming
you named the secret storing your owner ID `OWNER_ID`.

### Inputs

| Input                     | Description                                                                                                                        | Required |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `spec_path`               | Path to the OpenAPI spec file in JSON format                                                                                       | True     |
| `owner_id`                | Id of the team / user owning the existing API, or team / user to own the new API | True |
| `x_rapidapi_key`          | API key for the user / the team that will own this API on the Hub                                                                  | True     |
| `x_rapidapi_identity_key` | API key for the user that executes the action. If `x_rapidapi_key` is owned by a team, this field is required and needs to be belong to an individual user. | False     |
| `x_rapidapi_graphql_host` | GraphQL platform API host for the user / the team that will own this API on the Hub (e.g. `graphql-platform.yourhub.rapidapi.com`) | True     |
| `graphql_url`             | The URL to the GraphQL Platform API, defaults to `https://graphql-platform.p.rapidapi.com/` (mind the slash!)                      | True     |

### Outputs

| Output             | Description                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| `api_id`           | The ID of the newly created or updated API on the RapidAPI Hub              |
| `api_version_name` | The name (e.g. v0.2.0) of the newly created API version on the RapidAPI Hub |
| `api_version_id`   | The ID of the newly created API version on the RapidAPI Hub                 |

### Using outputs

The outputs of this action (`api_id` and `api_version_id`) can be used as input
to subsequent actions:

```yaml
steps:
- uses: actions/checkout@master
- name: Upload OAS to RapidAPI Hub for processing
  id: rapidapi-upload
  uses: maxim-rapidapi/creat_or_update_rapidapi@v0
  with:
    spec_path: openapi.json
    [...]

- name: Check outputs
    run: |
    echo "New API ID - ${{ steps.rapidapi-upload.outputs.api_id }}"
    echo "New API Version ID - ${{ steps.rapidapi-upload.outputs.api_version_id }}"
```

### Limitations

- You can only use this Action with APIs you own, either through personal or team credentials.
- There is no check to verify whether the `owner_id`, `x-rapidapi-identity-key` and the
  `x-rapidapi-key` belong together.
- There is no check whether an `x-rapidapi-identity-key` is required (in other words:
  whether or not the `x-rapidapi-key` belongs to a team).
- There is no support for `on-behalf-of` (which is a limitation of the GraphQL PAPI at
- the moment).
- Currently, the comparison that is done to figure out whether an API version already
    exists, is based on the currently active API version only. This results in the
    following behavior. If you have an API version that is active, like 1.0.1, and try
    and upload a new version 1.0.2, that new version will be a draft. If you then again
    upload an 1.0.2 version, the Action will only see the currently active version
    (1.0.1 in this case) and thus will try to create a new API version named 1.0.2. That
    will fail, for obvious reasons (as it already exists, in case it wasn't obvious).
    This is being worked on.

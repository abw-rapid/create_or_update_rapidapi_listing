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

If an existing API listing with the same name can be found, it will compare the the
version in `info.version` field in the OpenAPI spec file to what is available on the Hub
and decide - according to configurable policy - what to do with the OpenAPI spec file.
More about the possibilities of update [policy](#policy) below.

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
                  x_rapidapi_identity_key: another-very-long-api-key
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

## Policy
The GitHub Action allows you to set a policy for updating / creating new API versions on
the RapidAPI Hub. This functionality is still in flux, so make sure to read the rules
below and create issues for any bugs you find!

By default, the following rules will apply:

| Key                     | Default value | Decription                                            |
|-------------------------|---------------|-------------------------------------------------------|
| create_as               | "active"      | New API versions are to be created as active, draft or deprecated |
| allow_update_existing   | false         | Whether to re-upload if API version already exists
| allow_update_deprecated | true          | Whether to allow updates to API versions marked deprecated (not implemented yet)
| major.update_policy     | "create"      | What to do if the new OpenAPI spec contains a new major version
| major.allow_older       | true          | Allow creation of major versions that are older than the ones that already exist
| major.auto_current      | false         | Set new major versions as 'current' automatically?
| minor.update_policy     | "update"      | What to do if the new OpenAPI spec contains a new minor version
| minor.allow_older       | true          | Allow creation of minor versions that are older than the ones that already exist
| minor.auto_current      | false         | Set new minor versions as 'current' automatically?
| patch.update_policy     | "update"      | What to do if the new OPenAPI spec contains a new patch version
| patch.allow_older       | true          | Allow creation of patch versions that are older than the ones that already exist
| patch.auto_current      | false         | Set new patch versions as 'current'
automatically?

API versions on the Hub can be in three states: active (visible on Hub), draft (visibile
on Hub to API owner) and deprecated (visibile on Hub to owner and entities that have
previously subscribed to it). This settings configures what the default for new versions
will be. Active and draft are the most likely to be used. Use 'deprecated' only if e.g.
the whole API is deprecated but still maintained for some time.

#### Generic policy

The `allow_update_existing` key either allows or prohibits uploading e.g. a v1.0.1 into
an existing API version with that exact version number. Can be useful if you regularly
use the same version number. But your shouldn't really do this, so it's false by
default.

The `allow_update_deprecated` key either allows or prohibits updating API versions that
are marked as deprecated. Sometimes, we might want this (e.g. with a critical bug in an
API version that is marked as deprecated). This will be allowed by default, but at this
moment, this functionality is not implemented yet.

#### Version specific policy

Next are three blocks that define creation policy for major, minor and patch versions of
APIs. Each block has an `update_policy` key, an `allow_older` key and an `auto_current`
key.

The `update_policy` key can be 'create', 'update' or 'forbid'. If set as `create`, every
time the version number in the spec increases and this Action runs, a new API version
will be created on the Hub.

If set to `update`, every time the version number in the spec increases and this Action
runs, the closest lower version of this API will be updated to the version number that
is defined in the spec. E.g. if a v2.0.0. is available on the Hub already, and the new
spec contains v2.0.1, the existing v2.0.0 will be updated to be v2.0.1 and no new
version will be created.

If set to `forbid`, it will become forbidden to e.g. create new major versions of an
API. This can be useful for when you want to have a git branch to maintain a specific
released API version, and only every created patch versions from that branch. This is
not a fool-proof method of preventing creation of unintended API versions from a branch.
It will just prevent to most obvious mistakes.

The `allow_older` setting allows or prohibits the creation of APIs with a lower version
number than already exist. E.g. if v1.5.4 exists on the Hub, and this settings is false
for patch versions, uploading a spec with v1.5.2 in it will result in an error.

Finally, `auto_current` defines whether or not newly created versions will be marked as
current (i.e. the default on the Hub) automatically. Default is false, some use cases
might benefit from this, like having a git branch to maintain v1.1.x, and having set
`update_policy` for patch to `create`. Every time you bump the version in your spec, the
Action will create a new version on the Hub that is both active and current.

#### Config file format

Configuration files are in toml format, and can be added per branch. The need to follow
this naming convention: `rapidConfig.$BRANCH.toml`, where `$BRANCH` is the name of the
git branch the configuration file is for, e.g. ` main`. If you want to have a single
configuration file for all branches, call it `rapidConfig.default.toml`.

The format of the config file is as follows (these are the default values:
```toml
[general]
create_as = "active"
allow_update_existing = false
allow_update_deprecated = true

[major]
update_policy = "create"
allow_older = true
auto_current = false

[minor]
update_policy = "update"
allow_older = true
auto_current = false

[patch]
update_policy = "update"
allow_older = true
auto_current = false
```

## Limitations

- You can only use this Action with APIs you own, either through personal or team
  credentials.
- The `allow_update_deprecated` configuration file key isn't implemented yet.
- There is no check to verify whether the `owner_id`, `x-rapidapi-identity-key` and the
  `x-rapidapi-key` belong together.
- There is no check whether an `x-rapidapi-identity-key` is required (in other words:
  whether or not the `x-rapidapi-key` belongs to a team).
- There is no support for `on-behalf-of` (which is a limitation of the GraphQL PAPI at
  the moment).
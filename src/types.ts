// Describes the response as received from the gPAPI, containing an apis object
export type apiResponseObject = {
  apis: apis
}

/* This is the apis object received from the gPAPI as part of a query for APIs, containing
a 'nodes' object, that in turn contains an array of api objects */
export type apis = {
  nodes: Array<api>
}

// Describes an api object as queried and received from the gPAPI
export type api = {
  id: string
  name: string
}

// Describes the response as received from the gPAPI, containing an apiVersions object
export type apiVersionsResponseObject = {
  apiVersions: apiVersions
}

/* This is the apiVersions object received from the gPAPI as part of a query for apiVersions, containing
a 'nodes' object, that in turn contains an array of apiVersion objects */
export type apiVersions = {
  nodes: Array<apiVersion>
}

// Describes an apiVersion object as received from the gPAPI
// The 'api' property is optional, because in some cases, it is not present 
// TODO: add documentation on why and when the api property is not used
export type apiVersion = {
  id: string
  name: string
  current?: boolean
  api?: string
  versionStatus?: apiVersionStatus
}

// additional type for the createApiVersions mutation */
export type createApiVersionResponseObject = {
  createApiVersions: Array<apiVersion>
}

// enum to describe the update "level" between two different SemVers 
export enum updateEnum {
  major = "major",
  minor = "minor",
  patch = "patch"
}

// enum to describe the update method
export enum updateMethod {
  create = "create",
  update = "update",
  forbidden = "forbidden"
}


// status enum for apiVersions
export enum apiVersionStatus {
  active = "ACTIVE",
  draft = "DRAFT",
  deprecated = "DEPRECATED"
}

export type apiPolicy = {
  method: updateMethod
  setCurrent: boolean
  createAs: apiVersionStatus
  updateType: updateEnum
  api: string
}
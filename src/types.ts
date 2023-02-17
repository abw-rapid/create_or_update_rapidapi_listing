import { SemVer } from 'semver'

/* API types */
export type apiResponseObject = {
  apis: apis
}
export type apis = {
  nodes: Array<api>
}

export type api = {
  id: string
  name: string
}

export enum apiVersionStatus {
  DRAFT,
  ACTIVE,
  DEPRECATED
}


/* API version types */
export type apiVersionsResponseObject = {
  apiVersions: apiVersions
}

export type apiVersions = {
  nodes: Array<apiVersion>
}

export type apiVersion = {
  id: string
  name: SemVer
  current?: boolean
  api?: string
  versionStatus?: apiVersionStatus
}

/* additional type for the createApiVersions mutation */
export type createApiVersionResponseObject = {
  createApiVersions: Array<apiVersion>
}

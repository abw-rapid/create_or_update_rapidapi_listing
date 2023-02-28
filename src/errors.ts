class UpdatePolicyError extends Error {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

class MultipleAPIsFoundError extends Error {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

class InvalidCollectionError extends Error {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

class NoApiVersionsFoundError extends Error {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

class PlatformAPIError extends Error {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

class SpecParsingError extends Error {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

class UnexpectedResponseError extends Error {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

class UnexpectedStatusError extends Error {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export {
  UpdatePolicyError,
  MultipleAPIsFoundError,
  InvalidCollectionError,
  NoApiVersionsFoundError,
  PlatformAPIError,
  SpecParsingError,
  UnexpectedResponseError,
  UnexpectedStatusError
}

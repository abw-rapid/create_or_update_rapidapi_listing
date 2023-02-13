"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnexpectedStatusError = exports.UnexpectedResponseError = exports.SpecParsingError = exports.PlatformAPIError = exports.NoCurrentVersionError = exports.InvalidCollectionError = void 0;
class InvalidCollectionError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.InvalidCollectionError = InvalidCollectionError;
class NoCurrentVersionError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.NoCurrentVersionError = NoCurrentVersionError;
class PlatformAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.PlatformAPIError = PlatformAPIError;
class SpecParsingError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.SpecParsingError = SpecParsingError;
class UnexpectedResponseError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.UnexpectedResponseError = UnexpectedResponseError;
class UnexpectedStatusError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.UnexpectedStatusError = UnexpectedStatusError;

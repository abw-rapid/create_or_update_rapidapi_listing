"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSpec = void 0;
const fs_1 = __importDefault(require("fs"));
/**
 * Return JSON string containing the contents of an OAS
 * @param {string} oas Path to OAS
 * @return {string} The contents of the OAS
 */
function readSpec(oas) {
    try {
        const spec = fs_1.default.readFileSync(oas, "utf-8");
        try {
            return JSON.parse(spec);
        }
        catch (err) {
            throw new Error("Couldn't parse file: " + oas);
        }
    }
    catch (err) {
        console.log(err);
        throw new Error('Could not read file: ' + oas);
    }
}
exports.readSpec = readSpec;

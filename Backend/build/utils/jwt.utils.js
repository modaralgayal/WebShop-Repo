"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.signJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// sign jwt
const privatekey = process.env.PRIVATEKEY || undefined;
const publickey = process.env.PUBLICKEY || undefined;
// sign jwt
function signJWT(payload, expiresIn) {
    //console.log(privatekey)
    if (!privatekey) {
        throw new Error("Private key is not defined.");
    }
    return jsonwebtoken_1.default.sign(payload, privatekey, { algorithm: "RS256", expiresIn });
}
exports.signJWT = signJWT;
// verify jwt
function verifyJWT(token) {
    try {
        if (!publickey) {
            throw new Error("Public key is not defined.");
        }
        const decoded = jsonwebtoken_1.default.verify(token, publickey);
        return { payload: decoded, expired: false };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "";
        return { payload: null, expired: errorMessage.includes("jwt expired") };
    }
}
exports.verifyJWT = verifyJWT;

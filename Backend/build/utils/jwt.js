"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJWT = signJWT;
exports.verifyJWT = verifyJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const credential_provider_ini_1 = require("@aws-sdk/credential-provider-ini");
const secretsManagerClient = new client_secrets_manager_1.SecretsManagerClient({
    region: "eu-north-1",
    credentials: (0, credential_provider_ini_1.fromIni)({ profile: "default" }),
});
const getSecretValue = (secretName, key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = new client_secrets_manager_1.GetSecretValueCommand({ SecretId: secretName });
        const data = yield secretsManagerClient.send(command);
        if (data.SecretString) {
            const secretData = JSON.parse(data.SecretString);
            return secretData[key];
        }
        return undefined;
    }
    catch (err) {
        console.error("Error retrieving secret:", err.message);
        return undefined;
    }
});
const formatKey = (key, isPublic) => {
    var _a;
    const header = isPublic
        ? "-----BEGIN PUBLIC KEY-----"
        : "-----BEGIN RSA PRIVATE KEY-----";
    const footer = isPublic
        ? "-----END PUBLIC KEY-----"
        : "-----END RSA PRIVATE KEY-----";
    const cleanedKey = key
        .replace(/-----BEGIN (PUBLIC|PRIVATE) KEY-----/g, "")
        .replace(/-----END (PUBLIC|PRIVATE) KEY-----/g, "")
        .replace(/\s+/g, "")
        .trim();
    const chunkSize = 64;
    const formattedKey = ((_a = cleanedKey.match(new RegExp(`.{1,${chunkSize}}`, "g"))) === null || _a === void 0 ? void 0 : _a.join("\n")) || "";
    return `${header}\n${formattedKey}\n${footer}`;
};
let privatekey;
let publickey;
const initializeKeys = () => __awaiter(void 0, void 0, void 0, function* () {
    const secretName = "websecrets";
    const privateKeySecret = yield getSecretValue(secretName, "PRIVATEKEY_OWN_SITE");
    const publicKeySecret = yield getSecretValue(secretName, "PUBLICKEY_OWN_SITE");
    if (privateKeySecret) {
        privatekey = formatKey(privateKeySecret, false);
    }
    if (publicKeySecret) {
        publickey = formatKey(publicKeySecret, true);
    }
    if (!privatekey || !publickey) {
        throw new Error("Private key or public key is not defined.");
    }
});
initializeKeys().catch((err) => console.error("Failed to initialize keys:", err));
function signJWT(payload, expiresIn) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!privatekey) {
            throw new Error("Private key is not defined.");
        }
        return jsonwebtoken_1.default.sign(payload, privatekey, { algorithm: "RS256", expiresIn });
    });
}
function verifyJWT(token) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}

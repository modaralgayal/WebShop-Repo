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
const express_1 = __importDefault(require("express"));
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const credential_provider_ini_1 = require("@aws-sdk/credential-provider-ini");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const loggingRouter_1 = __importDefault(require("./routers/loggingRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
dotenv_1.default.config();
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
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Allow multiple origins for CORS
const allowedOrigins = [
    "https://www.modarshop.online",
    "https://modarshop.online",
    "https://api.modarshop.online",
    "http://localhost:5173", // Include localhost for development
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies to be sent along with requests
}));
app.get("/hello", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json("Hello Mate!");
}));
app.use((0, cookie_parser_1.default)());
app.use("/", loggingRouter_1.default);
app.use(express_1.default.static("dist"));
app.use(express_1.default.static("/productPng"));
let mongoUrl;
let port;
const initializeSecrets = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoUrl = yield getSecretValue("websecrets", "MONGO_URL");
});
initializeSecrets()
    .then(() => {
    const SERVER_PORT = port || 3002;
    app.listen(SERVER_PORT, () => {
        console.log(`Server running on port ${SERVER_PORT}`);
    });
    mongoose_1.default.Promise = Promise;
    if (mongoUrl) {
        mongoose_1.default
            .connect(mongoUrl)
            .then(() => {
            console.log("Connected to MongoDB");
        })
            .catch((err) => {
            console.error("MongoDB connection error:", err);
        });
    }
    else {
        console.error("MongoDB URL is not defined.");
    }
})
    .catch((err) => {
    console.error("Failed to initialize secrets:", err);
});

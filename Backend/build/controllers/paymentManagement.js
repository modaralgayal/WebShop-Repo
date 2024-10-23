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
exports.PaymentIntent = exports.Configure = void 0;
const stripe_1 = __importDefault(require("stripe"));
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
const initializeStripe = () => __awaiter(void 0, void 0, void 0, function* () {
    const secretKey = yield getSecretValue("websecrets", "STRIPE_SECRET_KEY");
    if (!secretKey) {
        throw new Error("Stripe secret key not found.");
    }
    return new stripe_1.default(secretKey, { apiVersion: "2024-09-30.acacia" });
});
const Configure = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stripe = yield initializeStripe();
        const publishableKey = yield getSecretValue("websecrets", "STRIPE_PUBLIC_KEY");
        if (stripe && publishableKey) {
            res.send({
                publishableKey,
            });
        }
        else {
            res.status(500).json({ error: "Stripe or publishable key is missing." });
        }
    }
    catch (error) {
        console.error("Error in Configure:", error);
        res.status(403).json({ error });
    }
});
exports.Configure = Configure;
const PaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalPrice } = req.body;
    const amountInCents = totalPrice * 100;
    console.log("Product ids in payment Intent: ", req.body);
    try {
        const stripe = yield initializeStripe();
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "EUR",
            payment_method_types: ["card"],
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        console.error("Error creating payment intent:", error.message);
        res.status(403).json({ error });
    }
});
exports.PaymentIntent = PaymentIntent;

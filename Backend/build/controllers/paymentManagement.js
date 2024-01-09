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
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-10-16",
});
const Configure = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send({
            publishableKey: process.env.STRIPE_PUBLIC_KEY,
        });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ error });
    }
});
exports.Configure = Configure;
const PaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalPrice } = req.body; // Extract totalPrice as a number
    const amountInCents = totalPrice * 100; // Convert price to cents
    console.log("Price in paymentIntent function: ", totalPrice);
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            currency: "EUR",
            amount: amountInCents,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
        console.log("ClientSecret sent");
    }
    catch (error) {
        console.error("Error creating payment intent:", error.message);
        res.status(403).json({ error });
    }
});
exports.PaymentIntent = PaymentIntent;

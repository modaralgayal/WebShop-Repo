"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registration_1 = require("../controllers/registration");
const userData_1 = require("../controllers/userData");
const verification_1 = require("../middleware/verification");
const productManagement_1 = require("../controllers/productManagement");
const deserializeuser_1 = require("../middleware/deserializeuser");
const paymentManagement_1 = require("../controllers/paymentManagement");
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
const router = express_1.default.Router();
// Auth routes
router.post("/auth/register", asyncHandler(registration_1.register));
router.post("/auth/login", asyncHandler(registration_1.login));
router.delete("/auth/logout", asyncHandler(registration_1.logOut));
router.get("/auth/user", asyncHandler(userData_1.getCurrentUser));
// User routes
router.get("/api/users", deserializeuser_1.deserializeUser, asyncHandler(userData_1.getAll));
router.get("/api/users/:id", asyncHandler(userData_1.getById));
router.delete("/api/users/:id", verification_1.isOwner, asyncHandler(userData_1.deleteById));
// Product routes
router.post("/api/products", asyncHandler(productManagement_1.addProductToShop));
router.post("/products/:id", asyncHandler(productManagement_1.addProductToBasket));
router.get("/api/products", asyncHandler(productManagement_1.getAllProducts));
router.get("/api/products/:id", asyncHandler(productManagement_1.getOneProduct));
router.delete("/products/:id", asyncHandler(productManagement_1.deleteItemFromBasket));
// Payment routes
router.get("/config", asyncHandler(paymentManagement_1.Configure));
router.post("/create-payment-intent", asyncHandler(paymentManagement_1.PaymentIntent));
// Order routes
router.post("/api/orders", asyncHandler(productManagement_1.addProductToOrdered));
router.get("/api/orders", asyncHandler(productManagement_1.getUserOrders));
exports.default = router;

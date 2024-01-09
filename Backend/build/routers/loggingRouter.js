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
const router = express_1.default.Router();
// Creating a user and logging in
router.post("/auth/register", registration_1.register);
router.post("/auth/login", registration_1.login);
router.delete("/auth/logout", registration_1.logOut);
router.get("/auth/user", userData_1.getCurrentUser);
// Retrieving user info
router.get("/api/users", deserializeuser_1.deserializeUser, userData_1.getAll);
router.get("/api/users/:id", userData_1.getById);
// deleting a user
router.delete("/api/users/:id", verification_1.isOwner, userData_1.deleteById);
// Manage products
router.post("/api/products", productManagement_1.addProductToShop);
router.post("/products/:id", productManagement_1.addProductToBasket);
router.get("/api/products", productManagement_1.getAllProducts);
router.delete("/products/:id", productManagement_1.deleteItemFromBasket);
// Payment Handlers
router.get("/config", paymentManagement_1.Configure);
router.post("/create-payment-intent", paymentManagement_1.PaymentIntent);
exports.default = router;

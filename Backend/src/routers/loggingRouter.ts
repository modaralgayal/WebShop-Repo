import express from "express";
import { register, login, logOut } from "../controllers/registration";
import {
  deleteById,
  getAll,
  getById,
  getCurrentUser,
} from "../controllers/userData";
import { isOwner } from "../middleware/verification";
import {
  addProductToBasket,
  addProductToOrdered,
  addProductToShop,
  deleteItemFromBasket,
  getAllProducts,
  getOneProduct,
  getUserOrders
} from "../controllers/productManagement";
import { deserializeUser } from "../middleware/deserializeuser";
import { Configure, PaymentIntent } from "../controllers/paymentManagement";

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const router = express.Router();

// Auth routes
router.post("/auth/register", asyncHandler(register));
router.post("/auth/login", asyncHandler(login));
router.delete("/auth/logout", asyncHandler(logOut));
router.get("/auth/user", asyncHandler(getCurrentUser));

// User routes
router.get("/api/users", deserializeUser, asyncHandler(getAll));
router.get("/api/users/:id", asyncHandler(getById));
router.delete("/api/users/:id", isOwner, asyncHandler(deleteById));

// Product routes
router.post("/api/products", asyncHandler(addProductToShop));
router.post("/products/:id", asyncHandler(addProductToBasket));
router.get("/api/products", asyncHandler(getAllProducts));
router.get("/api/products/:id", asyncHandler(getOneProduct));
router.delete("/products/:id", asyncHandler(deleteItemFromBasket));

// Payment routes
router.get("/config", asyncHandler(Configure));
router.post("/create-payment-intent", asyncHandler(PaymentIntent));

// Order routes
router.post("/api/orders", asyncHandler(addProductToOrdered));
router.get("/api/orders", asyncHandler(getUserOrders));

export default router;

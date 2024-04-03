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
  addProductToShop,
  deleteItemFromBasket,
  getAllProducts,
} from "../controllers/productManagement";
import { deserializeUser } from "../middleware/deserializeuser";
import { Configure, PaymentIntent } from "../controllers/paymentManagement";
import { getProductById } from "../types/schemas";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.delete("/auth/logout", logOut);
router.get("/auth/user", getCurrentUser);

router.get("/api/users", deserializeUser, getAll);
router.get("/api/users/:id", getById);

router.delete("/api/users/:id", isOwner, deleteById);

router.post("/api/products", addProductToShop);
router.post("/products/:id", addProductToBasket);
router.get("/api/products", getAllProducts);
router.get("/api/products/:id", getProductById);
router.delete("/products/:id", deleteItemFromBasket);

router.get("/config", Configure);
router.post("/create-payment-intent", PaymentIntent);

export default router;

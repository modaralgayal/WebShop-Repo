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
exports.getOneProduct = exports.getAllProducts = exports.getUserOrders = exports.addProductToShop = exports.addProductToOrdered = exports.deleteItemFromBasket = exports.addProductToBasket = void 0;
const schemas_1 = require("../types/schemas");
const mongoose_1 = __importDefault(require("mongoose"));
const addProductToBasket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const currentUserToken = req.body.userToken;
        const user = yield (0, schemas_1.getUserBySessionToken)(currentUserToken);
        console.log("Product Added Successfully");
        if (!user || !productId) {
            return res.status(404).json({ message: "User or Product Not Found" });
        }
        user.basket.push(productId);
        yield user.save();
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to add product to basket" });
    }
});
exports.addProductToBasket = addProductToBasket;
const deleteItemFromBasket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const currentUserToken = req.headers.authorization;
        if (!currentUserToken) {
            throw new Error("Token not Found");
        }
        const user = yield (0, schemas_1.getUserBySessionToken)(currentUserToken);
        if (!user || !productId) {
            return res.status(404).json({ message: "User or Product Not Found" });
        }
        const productIndex = user.basket.findIndex((item) => item.toString() === productId);
        if (productIndex === -1) {
            return res
                .status(404)
                .json({ message: "Product not found in the basket" });
        }
        user.basket.splice(productIndex, 1);
        yield user.save();
        console.log('DELETED ITEM FROM BASKET');
        return res.status(200).json(user);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to delete item from basket" });
    }
});
exports.deleteItemFromBasket = deleteItemFromBasket;
const addProductToOrdered = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productIds, userToken } = req.body;
        const user = yield (0, schemas_1.getUserBySessionToken)(userToken);
        if (!user || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(404).json({ message: "User or Product IDs Not Found" });
        }
        for (const { productId, quantity } of productIds) {
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                console.error(`Invalid productId: ${productId}`);
                return res.status(400).json({ message: `Invalid productId: ${productId}` });
            }
            const orderedProduct = user.ordered.find((item) => item.product.equals(new mongoose_1.default.Types.ObjectId(productId)));
            if (orderedProduct) {
                orderedProduct.quantity += quantity;
            }
            else {
                user.ordered.push({
                    product: new mongoose_1.default.Types.ObjectId(productId),
                    quantity: quantity,
                });
            }
            for (let i = 0; i < quantity; i++) {
                const productIndex = user.basket.findIndex((item) => item.toString() === productId);
                if (productIndex !== -1) {
                    user.basket.splice(productIndex, 1);
                }
            }
        }
        yield user.save();
        return res.status(200).json(user);
    }
    catch (error) {
        console.error("Error adding products to ordered:", error);
        return res.status(500).json({ message: "Failed to add products to ordered" });
    }
});
exports.addProductToOrdered = addProductToOrdered;
const addProductToShop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        yield (0, schemas_1.createProduct)(product);
        return res.status(200).json("Addition successful");
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
});
exports.addProductToShop = addProductToShop;
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUserToken = req.headers.authorization;
        if (!currentUserToken) {
            throw new Error("Token not Found");
        }
        const user = yield (0, schemas_1.getUserBySessionToken)(currentUserToken);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        const orderedItems = user;
        return res.status(200).json(orderedItems);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to fetch orders" });
    }
});
exports.getUserOrders = getUserOrders;
const getAllProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, schemas_1.getProducts)();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).send("Failed Fetching products");
    }
});
exports.getAllProducts = getAllProducts;
const getOneProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const product = yield (0, schemas_1.getProductById)(id);
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).send("Failed Fetching product");
    }
});
exports.getOneProduct = getOneProduct;

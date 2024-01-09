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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = exports.addProductToShop = exports.deleteItemFromBasket = exports.addProductToBasket = void 0;
const schemas_1 = require("../types/schemas");
const addProductToBasket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const currentUserToken = req.body.userToken;
        console.log(currentUserToken);
        const user = yield (0, schemas_1.getUserBySessionToken)(currentUserToken);
        console.log("Adding product to user: ", user);
        if (!user || !productId) {
            return res.status(404).json({ message: "User or Product Not Found" });
        }
        // Check if the product ID already exists in the user's basket
        // Push the product ID to the user's basket if it doesn't already exist
        user.basket.push(productId);
        yield user.save();
        return res.status(200).json(user);
    }
    catch (error) {
        // @ts-ignore
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
        // Find the index of the product ID in the user's basket array
        const productIndex = user.basket.findIndex((item) => item.toString() === productId);
        if (productIndex === -1) {
            return res
                .status(404)
                .json({ message: "Product not found in the basket" });
        }
        // Remove the product ID from the basket array
        user.basket.splice(productIndex, 1);
        yield user.save();
        return res.status(200).json(user);
    }
    catch (error) {
        // @ts-ignore
        // Send an error response
        return res
            .status(500)
            .json({ message: "Failed to delete item from basket" });
    }
});
exports.deleteItemFromBasket = deleteItemFromBasket;
const addProductToShop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        yield (0, schemas_1.createProduct)(product);
        return res.status(200).json("Addition successful");
    }
    catch (error) {
        // Send an error response
        console.log(error);
        return res.sendStatus(403);
    }
});
exports.addProductToShop = addProductToShop;
const getAllProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, schemas_1.getProducts)();
        // Send the products in the response
        res.status(200).json(products);
    }
    catch (error) {
        // Send an error response
        console.log("Failed Fetching products: ", error);
        res.status(500).send("Failed Fetching products");
    }
});
exports.getAllProducts = getAllProducts;

import { Request, Response } from "express";
import {
  createProduct,
  getProducts,
  getUserBySessionToken,
  getProductById,
} from "../types/schemas";
import mongoose from "mongoose";

export const addProductToBasket = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const currentUserToken = req.body.userToken;
    const user = await getUserBySessionToken(currentUserToken);
    console.log("Product Added Successfully");

    if (!user || !productId) {
      return res.status(404).json({ message: "User or Product Not Found" });
    }

    user.basket.push(productId);
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add product to basket" });
  }
};

export const deleteItemFromBasket = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const currentUserToken = req.headers.authorization as string | undefined;

    if (!currentUserToken) {
      throw new Error("Token not Found");
    }

    const user = await getUserBySessionToken(currentUserToken);

    if (!user || !productId) {
      return res.status(404).json({ message: "User or Product Not Found" });
    }

    const productIndex = user.basket.findIndex(
      (item) => item.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in the basket" });
    }

    user.basket.splice(productIndex, 1);
    await user.save();
    console.log('DELETED ITEM FROM BASKET');
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete item from basket" });
  }
};

export const addProductToOrdered = async (req: Request, res: Response) => {
  try {
    const { productIds, userToken } = req.body; 
    const user = await getUserBySessionToken(userToken);

    if (!user || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(404).json({ message: "User or Product IDs Not Found" });
    }

    for (const { productId, quantity } of productIds) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        console.error(`Invalid productId: ${productId}`);
        return res.status(400).json({ message: `Invalid productId: ${productId}` });
      }

      const orderedProduct = user.ordered.find((item) =>
        item.product.equals(new mongoose.Types.ObjectId(productId))
      );

      if (orderedProduct) {
        orderedProduct.quantity += quantity;
      } else {
        user.ordered.push({
          product: new mongoose.Types.ObjectId(productId),
          quantity: quantity,
        });
      }

      for (let i = 0; i < quantity; i++) {
        const productIndex = user.basket.findIndex(
          (item) => item.toString() === productId
        );

        if (productIndex !== -1) {
          user.basket.splice(productIndex, 1);
        }
      }
    }

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error adding products to ordered:", error);
    return res.status(500).json({ message: "Failed to add products to ordered" });
  }
};


export const addProductToShop = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    await createProduct(product);
    return res.status(200).json("Addition successful");
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const currentUserToken = req.headers.authorization as string | undefined;

    if (!currentUserToken) {
      throw new Error("Token not Found");
    }

    const user = await getUserBySessionToken(currentUserToken);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const orderedItems = user;
    return res.status(200).json(orderedItems);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send("Failed Fetching products");
  }
};

export const getOneProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await getProductById(id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).send("Failed Fetching product");
  }
};

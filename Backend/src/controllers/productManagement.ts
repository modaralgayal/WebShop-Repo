import { Request, Response } from "express";
import {
  createProduct,
  getProducts,
  getUserBySessionToken,
  getProductById,
} from "../types/schemas";

export const addProductToBasket = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const currentUserToken = req.body.userToken;
    console.log(currentUserToken);
    const user = await getUserBySessionToken(currentUserToken);
    console.log("Adding product to user: ", user);

    if (!user || !productId) {
      return res.status(404).json({ message: "User or Product Not Found" });
    }

    user.basket.push(productId);
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    // @ts-ignore
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

    return res.status(200).json(user);
  } catch (error) {
    // @ts-ignore
    return res
      .status(500)
      .json({ message: "Failed to delete item from basket" });
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
    console.log("This is the id:", id);
    const product = await getProductById(id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).send("Failed Fetching product");
  }
};

import { Request, Response } from 'express';
import { createProduct, getProducts, getUserBySessionToken } from '../types/schemas';

export const addProductToBasket = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const currentUserToken = req.cookies && typeof req.cookies.accessToken === 'string' ? req.cookies.accessToken : undefined;
    const user = await getUserBySessionToken(currentUserToken);

    if (!user || !productId) {
      throw new Error("User or product not found");
    }

    // Check if the product ID already exists in the user's basket
    const isProductAlreadyAdded = user.basket.some((item) => item.toString() === productId);
    if (isProductAlreadyAdded) {
      return res.status(400).json({ error: "Product already exists in the basket" });
    }

    // Push the product ID to the user's basket if it doesn't already exist
    user.basket.push(productId);
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    // Handle errors appropriately
    // @ts-ignore
    return res.status(500).json({ error: "Failed to add product to basket: " + error.message });
  }
};

export const deleteItemFromBasket = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const currentUserToken = req.cookies && typeof req.cookies.accessToken === 'string' ? req.cookies.accessToken : undefined;
    const user = await getUserBySessionToken(currentUserToken);

    if (!user || !productId) {
      throw new Error("User or product not found");
    }

    // Find the index of the product ID in the user's basket array
    const productIndex = user.basket.findIndex((item) => item.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in the basket" });
    }

    // Remove the product ID from the basket array
    user.basket.splice(productIndex, 1);
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    // Handle errors appropriately
    // @ts-ignore
    return res.status(500).json({ error: "Failed to delete item from basket: " + error.message });
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
    res.status(200).json(products); // Send the products in the response
  } catch (error) {
    console.log("Failed Fetching products: ", error);
    res.status(500).send("Failed Fetching products"); // Send an error response
  }
};
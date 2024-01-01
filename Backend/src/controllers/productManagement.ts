import { Request, Response } from 'express';
import { createProduct, getProducts, getUserBySessionToken } from '../types/schemas';

export const addProductToBasket = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const currentUserToken = req.cookies && typeof req.cookies.accessToken === 'string' ? req.cookies.accessToken : undefined;
    const user = await getUserBySessionToken(currentUserToken);

    if (!user || !productId) {
      return res.status(404).json({ message: "User or Product Not Found" });
    }

    // Check if the product ID already exists in the user's basket
    // Push the product ID to the user's basket if it doesn't already exist
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
    const currentUserToken = req.cookies && typeof req.cookies.accessToken === 'string' ? req.cookies.accessToken : undefined;
    const user = await getUserBySessionToken(currentUserToken);

    if (!user || !productId) {
      return res.status(404).json({ message: "User or Product Not Found" });
    }

    // Find the index of the product ID in the user's basket array
    const productIndex = user.basket.findIndex((item) => item.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in the basket" });
    }

    // Remove the product ID from the basket array
    user.basket.splice(productIndex, 1);
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    // @ts-ignore
    // Send an error response
    return res.status(500).json({ message: "Failed to delete item from basket" });
  }
};

export const addProductToShop = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    await createProduct(product);
    return res.status(200).json("Addition successful");
  } catch (error) {
    // Send an error response
    console.log(error);
    return res.sendStatus(403);    
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await getProducts();
    // Send the products in the response
    res.status(200).json(products); 
  } catch (error) {
    // Send an error response
    console.log("Failed Fetching products: ", error);
    res.status(500).send("Failed Fetching products"); 
  }
};
import { Request, Response } from 'express';
import { createProduct, getUserBySessionToken } from '../types/schemas';
import { ProductModel } from '../types/schemas'

export const addProductToBasket = async (req: Request, res: Response) => {
  try {
    const productId = req.body.id;
    const currentUserToken = req.cookies && typeof req.cookies.accessToken === 'string' ? req.cookies.accessToken : undefined;
    const user = await getUserBySessionToken(currentUserToken);
    const product = await ProductModel.findById(productId);

    if (!user || !product) {
      throw new Error("User or product not found");
    }

    // Push only the product ID to the user's basket
    user.basket.push(product._id); // Assuming 'product._id' is the ID of the product
    await user.save();

    return res.sendStatus(200).json(user);
  } catch (error) {
    // Handle errors appropriately
    // @ts-ignore
    return res.status(500).json({ error: "Failed to add product to basket: " + error.message });
  }
};

export const addProductToShop = async (req: Request, res: Response) => {
  try {
    const product = req.body
    await createProduct(product)
    return res.status(200).json("Addition successful")
  } catch (error) {
    console.log(error)
    return res.sendStatus(403)    
  }
}

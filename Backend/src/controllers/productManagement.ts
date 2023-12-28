import { Request, Response } from 'express';
import { getUserBySessionToken } from '../types/schemas';
import { ProductModel } from '../types/schemas'

export const addProductToBasket = async (req: Request, res: Response) => {
    try {
        const productId = req.body.id
        const currentUserToken = req.cookies && typeof req.cookies.accessToken === 'string' ? req.cookies.accessToken : undefined;
        const user = await getUserBySessionToken(currentUserToken)
        const product = await ProductModel.findById(productId);

        if (!user || !product) {
        throw new Error("User or product not found");
      }
  
      user.basket.push(product);
      await user.save();
  
      return res.sendStatus(200).json(user)
    } catch (error) {
      // @ts-ignore
      throw new Error("Failed to add product to basket: " + error.message);
    }
};

export const addProductToShop = async (req: Request, res: Response) => {
  
}

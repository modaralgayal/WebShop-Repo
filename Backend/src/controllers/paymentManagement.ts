import { Request, Response } from "express";
import Stripe from "stripe";
import axios from "axios"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export const Configure = async (_req: Request, res: Response) => {
  try {
    res.send({
      publishableKey: process.env.STRIPE_PUBLIC_KEY,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({ error });
  }
};

export const PaymentIntent = async (req: Request, res: Response) => {
  const { totalPrice, productIds, userToken }: { totalPrice: number, productIds: string[], userToken: string } = req.body; // Extract totalPrice, productIds, and userToken
  const amountInCents: number = totalPrice * 100; // Convert price to cents
  
  console.log("This is the payment intent body: ", req.body)
  console.log("Price in paymentIntent function: ", totalPrice);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "EUR",
      payment_method_types: ["card"],
    });

    console.log("ClientSecret sent");

    // Call addProductToOrdered after paymentIntent is successfully created
    try {
      const response = await axios.post(`http://localhost:3002/api/orders`, {
        productIds, // Send the product IDs
        userToken,  // Send the userToken to identify the user
      });

      if (response.status === 200) {
        console.log("Products added to ordered successfully");
      } else {
        console.error("Failed to add products to ordered", response.data);
      }
    } catch (addOrderError) {
      console.error("Error calling addProductToOrdered:", addOrderError);
    }

    // Send clientSecret to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error("Error creating payment intent:", error.message);
    res.status(403).json({ error });
  }
};
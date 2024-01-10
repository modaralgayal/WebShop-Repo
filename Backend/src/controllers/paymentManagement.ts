import { Request, Response } from "express";
import Stripe from "stripe";

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
  const { totalPrice }: { totalPrice: number } = req.body; // Extract totalPrice as a number
  const amountInCents: number = totalPrice * 100; // Convert price to cents

  console.log("Price in paymentIntent function: ", totalPrice);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "EUR",
      payment_method_types: ["card"],
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
    console.log("ClientSecret sent");
  } catch (error: any) {
    console.error("Error creating payment intent:", error.message);
    res.status(403).json({ error });
  }
};

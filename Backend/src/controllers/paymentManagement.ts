import { Request, Response } from "express";
import Stripe from "stripe";
import axios from "axios";
import AWS from "aws-sdk";

// Initialize the AWS Secrets Manager client
const secretsManager = new AWS.SecretsManager({ region: "eu-north-1" }); // Set your region

// Function to retrieve a secret from Secrets Manager
const getSecret = async (secretName: string): Promise<string | undefined> => {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    if ('SecretString' in data) {
      return data.SecretString;
    }
    return undefined;
  } catch (err) {
    console.error("Error retrieving secret:", err);
    return undefined;
  }
};

// Function to initialize Stripe with the secret key from Secrets Manager
const initializeStripe = async () => {
  const secretKey = await getSecret("webshopsecrets/production"); // Replace with your secret name
  if (!secretKey) {
    throw new Error("Stripe secret key not found.");
  }
  return new Stripe(secretKey, { apiVersion: "2023-10-16" });
};

export const Configure = async (_req: Request, res: Response) => {
  try {
    const stripe = await initializeStripe(); // Initialize Stripe here
    if (stripe) {
      res.send({
        publishableKey: process.env.STRIPE_PUBLIC_KEY, // If this is also in Secrets Manager, fetch it similarly
      });
    } 
  } catch (error) {
    console.log(error);
    res.status(403).json({ error });
  }
};

export const PaymentIntent = async (req: Request, res: Response) => {
  const { totalPrice, productIds, userToken } = req.body; 
  const amountInCents: number = totalPrice * 100;

  try {
    const stripe = await initializeStripe(); // Initialize Stripe here

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "EUR",
      payment_method_types: ["card"],
    });

    console.log("ClientSecret sent");

    // Call addProductToOrdered after paymentIntent is successfully created
    try {
      const response = await axios.post(`https://modarshop.online/api/orders`, {
        productIds, 
        userToken, 
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

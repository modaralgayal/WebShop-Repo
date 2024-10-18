import { Request, Response } from "express";
import Stripe from "stripe";
import axios from "axios";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secretsManagerClient = new SecretsManagerClient({ region: "eu-north-1" });

const getSecretValue = async (secretName: string, key: string): Promise<string | undefined> => {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await secretsManagerClient.send(command);

    if (data.SecretString) {
      const secret = JSON.parse(data.SecretString);

      if (key in secret) {
        return secret[key];
      } else {
        console.error(`Key "${key}" not found in the secret.`);
        return undefined;
      }
    }

    return undefined;
  } catch (err: any) {
    console.error("Error retrieving secret:", err.message);
    return undefined;
  }
};

const initializeStripe = async (): Promise<Stripe> => {
  const secretKey = await getSecretValue("webshopsecrets", "STRIPE_SECRET_KEY");
  if (!secretKey) {
    throw new Error("Stripe secret key not found.");
  }
  return new Stripe(secretKey, { apiVersion: "2024-09-30.acacia" });
};

export const Configure = async (_req: Request, res: Response) => {
  try {
    const stripe = await initializeStripe();
    const publishableKey = await getSecretValue("webshopsecrets", "STRIPE_PUBLIC_KEY");

    if (stripe && publishableKey) {
      res.send({
        publishableKey,
      });
    } else {
      res.status(500).json({ error: "Stripe or publishable key is missing." });
    }
  } catch (error) {
    console.error("Error in Configure:", error);
    res.status(403).json({ error });
  }
};

export const PaymentIntent = async (req: Request, res: Response) => {
  const { totalPrice, productIds, userToken } = req.body;
  const amountInCents: number = totalPrice * 100;

  try {
    const stripe = await initializeStripe();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "EUR",
      payment_method_types: ["card"],
    });

    console.log("ClientSecret sent");

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

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error.message);
    res.status(403).json({ error });
  }
};
``

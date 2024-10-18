import express from "express";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routers/loggingRouter";
import cookieParser from "cookie-parser";
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const secretsManagerClient = new SecretsManagerClient({
  region: "eu-north-1",
  credentials: fromIni({ profile: "default" })
});

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

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/", router);
app.use(express.static("dist"));
app.use(express.static("/productPng"));

let mongoUrl: string | undefined;
let port: string | number | undefined;

const initializeSecrets = async () => {
  mongoUrl = await getSecretValue("webshopsecrets", "MONGO_URL");
};

initializeSecrets().then(() => {
  const SERVER_PORT = port || 3002;

  app.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`);
  });

  mongoose.Promise = Promise;
  if (mongoUrl) {
    mongoose.connect(mongoUrl).then(() => {
      console.log("Connected to MongoDB");
    }).catch(err => {
      console.error("MongoDB connection error:", err);
    });
  } else {
    console.error("MongoDB URL is not defined.");
  }
}).catch(err => {
  console.error("Failed to initialize secrets:", err);
});

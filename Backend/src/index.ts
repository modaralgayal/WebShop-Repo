import express from "express";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"; // v3 SDK
import { fromIni } from "@aws-sdk/credential-provider-ini"; // Load credentials from the ini file
import cors from "cors";
import mongoose from "mongoose";
import router from "./routers/loggingRouter";
import cookieParser from "cookie-parser";
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
// Initialize the AWS Secrets Manager client using v3 SDK
const secretsManagerClient = new SecretsManagerClient({
  region: "eu-north-1", // Set your region
  credentials: fromIni({ profile: "default" }) // Optional: Specify your AWS profile
});

// Function to retrieve a secret from Secrets Manager using v3 SDK
const getSecretValue = async (secretName: string, key: string): Promise<string | undefined> => {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await secretsManagerClient.send(command); // v3 uses `send` method for commands

    if (data.SecretString) {
      const secret = JSON.parse(data.SecretString); // Parse the SecretString as JSON

      // Return the value associated with the provided key
      if (key in secret) {
        return secret[key]; // Return the value for the given key
      } else {
        console.error(`Key "${key}" not found in the secret.`);
        return undefined;
      }
    }

    return undefined;
  } catch (err: any) {
    // Log detailed error
    console.error("Error retrieving secret:", err.message);
    return undefined;
  }
};

// Create the Express app
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/", router);
app.use(express.static("dist"));
app.use(express.static("/productPng"));

// Initialize secrets
let mongoUrl: string | undefined;
let port: string | number | undefined;

const initializeSecrets = async () => {
  mongoUrl = await getSecretValue("webshopsecrets", "MONGO_URL"); // Assign directly to the outer mongoUrl
};

// Call initializeSecrets to load the secrets
initializeSecrets().then(() => {
  // Start the server only after secrets are loaded
  const SERVER_PORT = port || 3002; // Fallback to 3002 if port is not set

  app.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`);
  });

  // Set up mongoose connection
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

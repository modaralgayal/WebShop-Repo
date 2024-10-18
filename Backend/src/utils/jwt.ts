import jwt from "jsonwebtoken";
import {
  SecretsManagerClient,
  GetSecretValueCommand
} from "@aws-sdk/client-secrets-manager"; // v3 SDK
import { fromIni } from "@aws-sdk/credential-provider-ini"; // Import fromIni

// Initialize the AWS Secrets Manager client
const secretsManagerClient = new SecretsManagerClient({
  region: "eu-north-1", // Set your region
  credentials: fromIni({ profile: "default" }) // Specify your AWS profile
});

// Function to retrieve a specific key from a secret in Secrets Manager
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

// Fetch keys from AWS Secrets Manager
let privatekey: string | undefined;
let publickey: string | undefined;

const initializeKeys = async () => {
  // Use the updated getSecretValue to retrieve the keys
  privatekey = await getSecretValue("webshopsecrets", "PRIVATEKEY");
  publickey = await getSecretValue("webshopsecrets", "PUBLICKEY");

  if (!privatekey || !publickey) {
    throw new Error("Private key or public key is not defined.");
  }
};

// Call initializeKeys to load the keys
initializeKeys().catch(err => console.error("Failed to initialize keys:", err));

// Function to sign JWT
export async function signJWT(payload: object, expiresIn: string | number) {
  if (!privatekey) {
    throw new Error("Private key is not defined.");
  }

  return jwt.sign(payload, privatekey, { algorithm: "RS256", expiresIn });
}

// Function to verify JWT
export async function verifyJWT(token: string) {
  try {
    if (!publickey) {
      throw new Error("Public key is not defined.");
    }

    const decoded = jwt.verify(token, publickey);
    return { payload: decoded, expired: false };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    return { payload: null, expired: errorMessage.includes("jwt expired") };
  }
}

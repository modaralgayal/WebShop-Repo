import jwt from "jsonwebtoken";
import {
  SecretsManagerClient,
  GetSecretValueCommand
} from "@aws-sdk/client-secrets-manager";
import { fromIni } from "@aws-sdk/credential-provider-ini";

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

let privatekey: string | undefined;
let publickey: string | undefined;

const initializeKeys = async () => {
  privatekey = await getSecretValue("webshopsecrets", "PRIVATEKEY");
  publickey = await getSecretValue("webshopsecrets", "PUBLICKEY");

  if (!privatekey || !publickey) {
    throw new Error("Private key or public key is not defined.");
  }
};

initializeKeys().catch(err => console.error("Failed to initialize keys:", err));

export async function signJWT(payload: object, expiresIn: string | number) {
  if (!privatekey) {
    throw new Error("Private key is not defined.");
  }

  return jwt.sign(payload, privatekey, { algorithm: "RS256", expiresIn });
}

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

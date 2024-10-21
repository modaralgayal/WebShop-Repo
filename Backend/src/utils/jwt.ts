import jwt from "jsonwebtoken";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { fromIni } from "@aws-sdk/credential-provider-ini";

const secretsManagerClient = new SecretsManagerClient({
  region: "eu-north-1",
  credentials: fromIni({ profile: "default" }),
});

const getSecretValue = async (
  secretName: string,
  key: string
): Promise<string | undefined> => {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await secretsManagerClient.send(command);

    if (data.SecretString) {
      const secretData = JSON.parse(data.SecretString);
      return secretData[key];
    }

    return undefined;
  } catch (err: any) {
    console.error("Error retrieving secret:", err.message);
    return undefined;
  }
};

const formatKey = (key: string, isPublic: boolean): string => {
  const header = isPublic
    ? "-----BEGIN PUBLIC KEY-----"
    : "-----BEGIN RSA PRIVATE KEY-----";
  const footer = isPublic
    ? "-----END PUBLIC KEY-----"
    : "-----END RSA PRIVATE KEY-----";

  const cleanedKey = key
    .replace(/-----BEGIN (PUBLIC|PRIVATE) KEY-----/g, "")
    .replace(/-----END (PUBLIC|PRIVATE) KEY-----/g, "")
    .replace(/\s+/g, "")
    .trim();

  const chunkSize = 64;
  const formattedKey =
    cleanedKey.match(new RegExp(`.{1,${chunkSize}}`, "g"))?.join("\n") || "";

  return `${header}\n${formattedKey}\n${footer}`;
};

let privatekey: string | undefined;
let publickey: string | undefined;

const initializeKeys = async () => {
  const secretName = "websecrets";

  const privateKeySecret = await getSecretValue(
    secretName,
    "PRIVATEKEY_OWN_SITE"
  );
  const publicKeySecret = await getSecretValue(
    secretName,
    "PUBLICKEY_OWN_SITE"
  );

  if (privateKeySecret) {
    privatekey = formatKey(privateKeySecret, false);
  }

  if (publicKeySecret) {
    publickey = formatKey(publicKeySecret, true);
  }

  if (!privatekey || !publickey) {
    throw new Error("Private key or public key is not defined.");
  }
};

initializeKeys().catch((err) =>
  console.error("Failed to initialize keys:", err)
);

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

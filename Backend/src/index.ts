import express from "express";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routers/loggingRouter";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

dotenv.config();

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

const app = express();
app.use(express.json());

// Allow multiple origins for CORS
const allowedOrigins = [
  "https://www.modarshop.online",
  "https://modarshop.online",
  "https://api.modarshop.online",
  "http://localhost:5173", // Include localhost for development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies to be sent along with requests
  })
);

app.get("/hello", async (_req, res) => {
  res.json("Hello Mate!");
});

app.use(cookieParser());
app.use("/", router);
app.use(express.static("dist"));
app.use(express.static("/productPng"));

let mongoUrl: string | undefined;
let port: string | number | undefined;

const initializeSecrets = async () => {
  mongoUrl = await getSecretValue("websecrets", "MONGO_URL");
};

initializeSecrets()
  .then(() => {
    const SERVER_PORT = port || 3002;

    app.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });

    mongoose.Promise = Promise;
    if (mongoUrl) {
      mongoose
        .connect(mongoUrl)
        .then(() => {
          console.log("Connected to MongoDB");
        })
        .catch((err) => {
          console.error("MongoDB connection error:", err);
        });
    } else {
      console.error("MongoDB URL is not defined.");
    }
  })
  .catch((err) => {
    console.error("Failed to initialize secrets:", err);
  });

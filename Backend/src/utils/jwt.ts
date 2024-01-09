import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// sign jwt
const privatekey = process.env.PRIVATEKEY || undefined;
const publickey = process.env.PUBLICKEY || undefined;

// sign jwt
export function signJWT(payload: object, expiresIn: string | number) {
  //console.log(privatekey)
  if (!privatekey) {
    throw new Error("Private key is not defined.");
  }

  return jwt.sign(payload, privatekey, { algorithm: "RS256", expiresIn });
}

// verify jwt
export function verifyJWT(token: string) {
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

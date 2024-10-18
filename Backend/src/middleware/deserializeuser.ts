import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt";

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accessToken } = req.cookies;
  
  if (!accessToken) {
    console.log("AccessToken Not Found");
    return res.sendStatus(403);
  }
  
  console.log("Found Token");

  // Await the verification of the JWT
  const { payload, expired } = await verifyJWT(accessToken);

  if (payload) {
    // Attach the user payload to the request object
    // @ts-ignore
    req.user = payload;
  } else if (expired) {
    console.log("AccessToken has expired");
    return res.sendStatus(403);
  }

  // Call next middleware
  next();
  return null
}

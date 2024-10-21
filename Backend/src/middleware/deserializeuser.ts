import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt";

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { accessToken } = req.cookies;
  
  if (!accessToken) {
    //console.log("AccessToken Not Found");
    // @ts-ignore
    return res.sendStatus(403);
  }
  
  //console.log("Found Token");

  const { payload, expired } = await verifyJWT(accessToken);

  if (payload) {
    // @ts-ignore
    req.user = payload;
  } else if (expired) {
    //console.log("AccessToken has expired");
    // @ts-ignore
    return res.sendStatus(403);
  }

  next();
}

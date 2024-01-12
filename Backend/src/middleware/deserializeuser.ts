import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt";

export function deserializeUser(
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

  const { payload } = verifyJWT(accessToken);

  if (payload) {
    // @ts-ignore
    req.user = payload;
    return next();
  }
  return next();
}

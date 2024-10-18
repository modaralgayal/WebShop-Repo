import { Request, Response, NextFunction } from "express";
import { getUserBySessionToken } from "../types/schemas";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserToken =
      req.cookies && typeof req.cookies.accessToken === "string"
        ? req.cookies.accessToken
        : undefined;

    if (!currentUserToken) {
      console.log("Token Does not exist");
      // @ts-ignore
      return res.sendStatus(403);
    }

    const currentUser: any = await getUserBySessionToken(currentUserToken);

    if (!currentUser) {
      console.log("Current user does not exist");
      // @ts-ignore
      return res.sendStatus(403);
    }

    if (currentUser._id.toString() !== id) {
      console.log("You are not the owner");
      // @ts-ignore
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    // @ts-ignore
    return res.sendStatus(403);
  }
};

export const checkcookie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserToken =
      req.cookies && typeof req.cookies.accessToken === "string"
        ? req.cookies.accessToken
        : undefined;

    if (currentUserToken) {
      console.log("User exists, logging out");
      return next();
    }
  } catch (error) {
    console.log("problem checking user", error);
    return res.sendStatus(403);
  }
};

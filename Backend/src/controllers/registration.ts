import { createUser, getUserByEmail } from "../types/schemas";
import { random, authenticate } from "../helpers/randomizers";
import { signJWT } from "../utils/jwt";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "A Field Is Missing" });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(403).json({ message: "user does not exist" });
    }
    const expectedHash = authenticate(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.status(403).json({ message: "Wrong Password Try Again" });
    }
    const accessToken = await signJWT(
      { email: user.email, name: user.username },
      "1h"
    );
    user.authentication.sessionToken = accessToken;

    res.cookie("accessToken", accessToken, {
      maxAge: 30000,
      httpOnly: true,
    });
    await user.save();
    return res.send(user);
  } catch (error) {
    console.log("Error logging in", error);
    return res.status(400);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "A Field Is Missing" });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(403).json({ message: "User Already Exists" });
    }
    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt: salt,
        password: authenticate(salt, password),
        sessionToken: null,
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const logOut = async (_req: Request, res: Response) => {
  try {
    res.cookie("accessToken", "", {
      maxAge: 0,
    });
    res.send({ success: true });
  } catch (error) {
    res.status(403);
  }
};

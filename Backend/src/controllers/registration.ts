import { createUser, getUserByEmail } from "../types/schemas";
import { random, authenticate } from "../helpers/randomizers";
import { signJWT } from "../utils/jwt";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("a field is missing");
      return res.status(400).json({ message: "A Field Is Missing" });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      console.log("user does not exist");
      return res.status(403).json({ message: "user does not exist" });
    }
    const expectedHash = authenticate(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      console.log("wrong password");
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
    //console.log(user);
    return res.send(user);
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Received registration data:', req.body); // Log the request body
    const { email, username, password } = req.body;
    if (!email || !password || !username) {
      console.log("a field is missing");
      return res.status(400).json({ message: "A Field Is Missing" });
    }
    const existingUser = await getUserByEmail(email);
    //console.log(existingUser);
    if (existingUser) {
      console.log("user already exists");
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
    console.log(error);
    res.status(403);
  }
};

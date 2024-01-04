import {
  getUsers,
  getUserById,
  getUserBySessionToken,
  deleteUserById,
} from "../types/schemas";
import { Request, Response } from "express";

export const getAll = async (_req: Request, res: Response) => {
  try {
    const userData = await getUsers(); // Assuming getUsers is an asynchronous function fetching user data
    res.status(200).json(userData); // Sending the user data as JSON in the response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userData = await getUserById(userId);

    if (!userData) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(userData);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user data" });
  }
};

export const deleteById = async (req: Request, res: Response) => {
  try {
    const deleteId = req.params.id;
    const user = await getUserById(deleteId);

    if (!user) {
      console.log("User does not exist");
      return res.status(404).json({ message: "User not found" });
    }

    await deleteUserById(deleteId);
    return res.status(200).json({ message: "Deletion successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUserToken = req.headers.authorization;
    console.log(currentUserToken);

    if (!currentUserToken) {
      console.log("Token Does not exist");
      return res.sendStatus(403);
    }

    const currentUser = await getUserBySessionToken(currentUserToken);
    console.log(currentUser);
    return res.status(200).json(currentUser);
  } catch (error: any) {
    console.log(error.response.data.message);
    return error.response.data.message;
  }
};

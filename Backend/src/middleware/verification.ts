import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getUserBySessionToken } from "../types/users";
//import { getUserBySessionToken } from "../types/users";

declare global {
    namespace Express {
      interface Request {
        user?: any; // Modify the type according to your decoded token structure
      }
    }
  }

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.get('authorization')
    console.log(token)
  
    if (!token) {
      return res.status(401).send('Unauthorized: No token provided');
    }
  
    if (!process.env.SECRET) {
      console.error('Secret key is not defined.');
      return res.status(500).send('Internal Server Error');
    }
  
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send('Unauthorized: Invalid token');
      }
      // If token is valid, set decoded user information in request for later use
      req.user = decoded;
      return next(); // Pass control to the next middleware or route handler
    });
    return res.sendStatus(200)
};

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    console.log('Checking owner', id)
    const currentUserToken = req.cookies.authorization
    console.log(currentUserToken)

    const currentUserId = getUserBySessionToken(currentUserToken)
    console.log(currentUserId)

    if (!currentUserId) {
      console.log('Current user does not exist')
      return res.sendStatus(403)
    }

    return next()
  } catch (error) {
    
  }
}
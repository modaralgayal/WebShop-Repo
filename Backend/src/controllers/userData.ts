// import express from "express"; 
import { getUsers, getUserById, deleteUserById } from "../types/users";
import { NextFunction, Request, Response } from "express";
//import { verifyJWT } from "../utils/jwt.utils";


export const getAll = async (_req: Request, res: Response) => {
    try {
        const userData = await getUsers(); // Assuming getUsers is an asynchronous function fetching user data
        res.status(200).json(userData); // Sending the user data as JSON in the response
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const userData = await getUserById(userId);
        
        if (!userData) {
            console.log('User not found')
            return res.status(404).json({ error: 'User not found' });
        }
        
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch user data' });
    }
};

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    //const { token } = req.cookies

    const deleteId = req.params.id

    if (!getUserById(deleteId)) {
        console.log('User does not exist')
        return next()
    }
    try {
        await deleteUserById(deleteId)
        return res.sendStatus(200).json({ message: 'Deletion successful' })
    } catch (error) {
        console.log(error)
        return res.sendStatus(403)
    }
}
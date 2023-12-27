import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt.utils";

export function deserializeUser(req: Request, res: Response, next: NextFunction) {
    const {accessToken} = req.cookies;
    // console.log(accessToken)
    if(!accessToken) {
        console.log('AccessToken Not Found')
        return res.sendStatus(403)
    }
    console.log('Found Token')

    const {payload} = verifyJWT(accessToken);

    if (payload) {
        // @ts-ignore
        req.user = payload
        return next()
    }
    return next()
}
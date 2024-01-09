"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUser = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
function deserializeUser(req, res, next) {
    const { accessToken } = req.cookies;
    // console.log(accessToken)
    if (!accessToken) {
        console.log("AccessToken Not Found");
        return res.sendStatus(403);
    }
    console.log("Found Token");
    const { payload } = (0, jwt_utils_1.verifyJWT)(accessToken);
    if (payload) {
        // @ts-ignore
        req.user = payload;
        return next();
    }
    return next();
}
exports.deserializeUser = deserializeUser;

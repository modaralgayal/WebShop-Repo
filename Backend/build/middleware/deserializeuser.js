"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUser = deserializeUser;
const jwt_1 = require("../utils/jwt");
function deserializeUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            //console.log("AccessToken Not Found");
            // @ts-ignore
            return res.sendStatus(403);
        }
        //console.log("Found Token");
        const { payload, expired } = yield (0, jwt_1.verifyJWT)(accessToken);
        if (payload) {
            // @ts-ignore
            req.user = payload;
        }
        else if (expired) {
            //console.log("AccessToken has expired");
            // @ts-ignore
            return res.sendStatus(403);
        }
        next();
    });
}

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
exports.checkcookie = exports.isOwner = void 0;
const schemas_1 = require("../types/schemas");
const isOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const currentUserToken = req.cookies && typeof req.cookies.accessToken === "string"
            ? req.cookies.accessToken
            : undefined;
        if (!currentUserToken) {
            console.log("Token Does not exist");
            return res.sendStatus(403);
        }
        const currentUser = yield (0, schemas_1.getUserBySessionToken)(currentUserToken);
        console.log("Current user is", currentUser);
        if (!currentUser) {
            console.log("Current user does not exist");
            return res.sendStatus(403);
        }
        if (currentUser._id.toString() !== id) {
            console.log("You are not the owner");
            return res.sendStatus(403);
        }
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
});
exports.isOwner = isOwner;
const checkcookie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUserToken = req.cookies && typeof req.cookies.accessToken === "string"
            ? req.cookies.accessToken
            : undefined;
        if (currentUserToken) {
            console.log("User exists, logging out");
            return next();
        }
    }
    catch (error) {
        console.log("problem checking user", error);
        return res.sendStatus(403);
    }
});
exports.checkcookie = checkcookie;

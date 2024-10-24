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
exports.logOut = exports.register = exports.login = void 0;
const schemas_1 = require("../types/schemas");
const randomizers_1 = require("../helpers/randomizers");
const jwt_1 = require("../utils/jwt");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "A Field Is Missing" });
        }
        const user = yield (0, schemas_1.getUserByEmail)(email).select("+authentication.salt +authentication.password");
        if (!user) {
            return res.status(403).json({ message: "user does not exist" });
        }
        const expectedHash = (0, randomizers_1.authenticate)(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({ message: "Wrong Password Try Again" });
        }
        const accessToken = yield (0, jwt_1.signJWT)({ email: user.email, name: user.username }, "1h");
        user.authentication.sessionToken = accessToken;
        res.cookie("accessToken", accessToken, {
            maxAge: 30000,
            httpOnly: true,
        });
        yield user.save();
        return res.send(user);
    }
    catch (error) {
        console.log("Error logging in", error);
        return res.status(400);
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ message: "A Field Is Missing" });
        }
        const existingUser = yield (0, schemas_1.getUserByEmail)(email);
        if (existingUser) {
            return res.status(403).json({ message: "User Already Exists" });
        }
        const salt = (0, randomizers_1.random)();
        const user = yield (0, schemas_1.createUser)({
            email,
            username,
            authentication: {
                salt: salt,
                password: (0, randomizers_1.authenticate)(salt, password),
                sessionToken: null,
            },
        });
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
});
exports.register = register;
const logOut = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("accessToken", "", {
            maxAge: 0,
        });
        res.send({ success: true });
    }
    catch (error) {
        res.status(403);
    }
});
exports.logOut = logOut;

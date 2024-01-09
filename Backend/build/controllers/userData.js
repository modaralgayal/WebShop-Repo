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
exports.getCurrentUser = exports.deleteById = exports.getById = exports.getAll = void 0;
const schemas_1 = require("../types/schemas");
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield (0, schemas_1.getUsers)(); // Assuming getUsers is an asynchronous function fetching user data
        res.status(200).json(userData); // Sending the user data as JSON in the response
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});
exports.getAll = getAll;
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const userData = yield (0, schemas_1.getUserById)(userId);
        if (!userData) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(userData);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch user data" });
    }
});
exports.getById = getById;
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteId = req.params.id;
        const user = yield (0, schemas_1.getUserById)(deleteId);
        if (!user) {
            console.log("User does not exist");
            return res.status(404).json({ message: "User not found" });
        }
        yield (0, schemas_1.deleteUserById)(deleteId);
        return res.status(200).json({ message: "Deletion successful" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteById = deleteById;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUserToken = req.headers.authorization;
        console.log(currentUserToken);
        if (!currentUserToken) {
            console.log("Token Does not exist");
            return res.sendStatus(403);
        }
        const currentUser = yield (0, schemas_1.getUserBySessionToken)(currentUserToken);
        console.log(currentUser);
        return res.status(200).json(currentUser);
    }
    catch (error) {
        console.log(error.response.data.message);
        return error.response.data.message;
    }
});
exports.getCurrentUser = getCurrentUser;

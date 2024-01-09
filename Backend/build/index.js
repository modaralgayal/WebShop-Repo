"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const loggingRouter_1 = __importDefault(require("./routers/loggingRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use("/", loggingRouter_1.default);
app.use(express_1.default.static("dist"));
app.use(express_1.default.static("/productPng"));
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
mongoose_1.default.Promise = Promise;
if (MONGO_URL) {
    mongoose_1.default.connect(MONGO_URL);
    console.log("Connected to MongoDB");
}
else {
    console.error("MongoDB URL is not defined.");
}

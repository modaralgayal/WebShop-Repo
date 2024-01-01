import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import router from './routers/loggingRouter';
import cookieParser from 'cookie-parser';
import { deserializeUser } from "./middleware/deserializeuser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/', router);
app.use(deserializeUser);
app.use(express.static("/productPng"))

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.Promise = Promise;
if (MONGO_URL) {
  mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');
} else {
  console.error("MongoDB URL is not defined.");
}



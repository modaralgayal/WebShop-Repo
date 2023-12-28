import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: {type: String, select: false}
    },
    basket: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', select: true }]
});

export const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    icon: {type: String, required: false}
});


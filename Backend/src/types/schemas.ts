import { model, Document } from "mongoose";
import { userSchema, productSchema } from "../models/models";

interface User extends Document {
  email: string;
  username: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken: string;
  };
  basket: Array<Product | any>;
}

interface Product extends Document {
  name: string;
  price: number;
  category: string;
  description: string;
  icon: string;
}

const UserModel = model<User>("User", userSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  }).select("+authentication.sessionToken");
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);

const ProductModel = model<Product>("Product", productSchema);

export const getProducts = () => ProductModel.find();
export const getProductById = (id: string) => ProductModel.findById(id);
export const createProduct = (values: Record<string, any>) =>
  new ProductModel(values).save().then((product) => product.toObject());
export const updateProductById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);

export { UserModel, ProductModel };

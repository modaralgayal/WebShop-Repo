import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { UserFormValues, User, LoginValue, CreatorValues } from "../types"


const getAll = async () => {
  try {
      const response = await axios.get<UserFormValues[]>(`${apiBaseUrl}/api/users`);
      return response.data;
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch users');
    }
};

const create = async (object: CreatorValues) => {
  try {
    console.log('creating');
    const { data } = await axios.post<User>(`${apiBaseUrl}/auth/register`, object);
    console.log(data);
    return data; // Return data upon success
  } catch (error: any) {
    // Handle error
    console.error('Error during user creation:', error.response.data.message);
    throw new Error(error.response.data.message)
  }
};

const login = async (object: LoginValue) => {
  try {
    const { data } = await axios.post(`${apiBaseUrl}/auth/login`, object);
    console.log(data);
    return data;
  } catch (error: any) {
    // Handle error
    console.error('Error during login:', error.response.data.message);
    throw new Error(error.response.data.message);
  }
};

const logOut = async () => {
  try {
    const response = await axios.post(`${apiBaseUrl}/auth/logout`);
    console.log('User Logged out',response.data)
    return response.data; // Extract data from the response
  } catch (error) {
    console.log(error);
    // Handle the error or return null/undefined if needed
    return null;
  }
};


const addProductToBasket = async (productId: string) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/products/${productId}`)
    return response.data
  } catch (error: any) {
    console.log(error)
    return error.response.data.message
  }
}


const deleteProductFromBasket = async (productId: string) => {
  try {
    const response = await axios.delete(`${apiBaseUrl}/products/${productId}`)
    return response.data
  } catch (error: any) {
    console.log(error)
    return error.response.data.message
  }
}


export default {
    getAll, create, login, logOut, addProductToBasket, deleteProductFromBasket
}
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

const checkExistingUser = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/`);
    
    // Check if the response contains the 'Set-Cookie' header
    const setCookieHeader = response.headers;
    console.log(setCookieHeader)
    if (setCookieHeader) {
      // The 'Set-Cookie' header exists, indicating the presence of a cookie
      console.log('Access cookie exists:', setCookieHeader);
      // You can further process the cookie information or take action accordingly
    } else {
      // There might not be any 'Set-Cookie' header in the response
      console.log('No access cookie found in the response.');
    }

    // If you need to access the response data, you can do so like this:
    // const responseData = response.data;
    // Further actions based on the response data if needed
  } catch (error: any) {
    console.error('Error checking existing user:', error.response);
  }
};



export default {
    getAll, create, login, logOut, checkExistingUser
}
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { UserFormValues, User, LoginValue, CreatorValues } from "../types"


const getAll = async () => {
    try {
        const response = await axios.get<UserFormValues[]>(`${apiBaseUrl}/users`);
        return response.data;
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch users');
      }
};

const create = async (object: CreatorValues) => {
    const { data } = await axios.post<User>(
      `${apiBaseUrl}/auth/register`,
      object
    );
  
    return data;
  };

  const login = async (object: LoginValue) => {
    const { data } = await axios.post(
      `${apiBaseUrl}/auth/login`,
      object
    );
  
    return data;
  };

export default {
    getAll, create, login
}
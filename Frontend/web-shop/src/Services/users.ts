import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { UserFormValues, User } from "../types"


const getAll = async () => {
    const { data } = await axios.get<UserFormValues[]>(
        `${apiBaseUrl}/users`
    );

    return data;
};

const create = async (object: UserFormValues) => {
    const { data } = await axios.post<User>(
      `${apiBaseUrl}/patients`,
      object
    );
  
    return data;
  };


export default {
    getAll, create
}
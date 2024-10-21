import axios from 'axios'
import { apiBaseUrl } from '../constants'
import { UserFormValues, User, LoginValue, CreatorValues } from '../types'

const getAll = async () => {
  try {
    const response = await axios.get<UserFormValues[]>(
      `${apiBaseUrl}/api/users`,
    )
    return response.data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch users')
  }
}

const create = async (object: CreatorValues) => {
  try {
    console.log('creating')
    const { data } = await axios.post<User>(
      `${apiBaseUrl}/auth/register`,
      object,
    )
    return data 
  } catch (error: any) {
    console.error('Error during user creation:', error.response.data.message)
    throw new Error(error.response.data.message)
  }
}

const login = async (object: LoginValue) => {
  try {
    const { data } = await axios.post(`${apiBaseUrl}/auth/login`, object)
    return data
  } catch (error: any) {
    console.error('Error during login:', error)
    throw new Error(error)
  }
}

const logOut = async () => {
  try {
    const response = await axios.delete(`${apiBaseUrl}/auth/logout`)
    return response.data
  } catch (error) {
    console.log(error)
    return null
  }
}

const addProductToBasket = async (productId: string, userToken: string) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/products/${productId}`,
      { userToken: userToken },
    )
    return response.data
  } catch (error: any) {
    console.log(error)
    return error.response.data.message
  }
}

const deleteProductFromBasket = async (
  productId: string,
  userToken: string,
) => {
  try {
    const response = await axios.delete(`${apiBaseUrl}/products/${productId}`, {
      headers: {
        Authorization: `${userToken}`,
      },
    })
    return response.data
  } catch (error: any) {
    console.log(error)
    return error.response.data.message
  }
}

const currentUserInfo = async (userToken: string) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/auth/user`, {
      headers: {
        Authorization: `${userToken}`,
      },
    })
    return response.data
  } catch (error: any) {
    console.log(error)
    return error.response.data.message
  }
}

export default {
  getAll,
  create,
  login,
  logOut,
  addProductToBasket,
  deleteProductFromBasket,
  currentUserInfo,
}

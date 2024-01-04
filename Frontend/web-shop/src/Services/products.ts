import axios from 'axios'
import { apiBaseUrl } from '../constants'

const getAll = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/products`)
    return response.data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch Products')
  }
}

export default { getAll }

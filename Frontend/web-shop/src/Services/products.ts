import axios from 'axios';
import { apiBaseUrl } from '../constants';

const getAll = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/products`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch Products');
  }
};

const getProductById = async (productId: string | undefined) => {
  try {
    if (!productId) {
      throw new Error('Product ID is undefined');
    }

    const response = await axios.get(`${apiBaseUrl}/api/products/${productId}`);
    console.log("This is the response:", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch Product');
  }
};


export default { getAll, getProductById };

import axios from 'axios';

const baseUrl = '/api/';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${baseUrl}products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const Login = async (username, password) => {
  try {
    const response = await axios.post(`${baseUrl}login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const Order = async (user, products, address) => {
  try {
    const response = await axios.post(`${baseUrl}orders`, { user, products, address });
    console.log(response.data.url);
    window.location = response.data.url   
  } catch (error) {
    console.error('Error registering order:', error);
    throw error;
  }
};

export const Register = async (name, username, email, password) => {
  try {
    const response = await axios.post(`${baseUrl}users`, { name, username, email, password });
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const updateUser = async (userId, token, updatedData) => {

  try {
    const response = await axios.put(`${baseUrl}users/${userId}`, updatedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getUser = async (userId, token) => {

  try {
    const response = await axios.get(`${baseUrl}users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
export const getOrder = async (orderId, token) => {

  try {
    const response = await axios.get(`${baseUrl}orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export default {
  fetchProducts,
  Login,
  Register,
  updateUser,
  getProduct,
  Order,
  getUser,
  getOrder,
};
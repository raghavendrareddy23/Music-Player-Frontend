import axios from 'axios';

const API_BASE_URL = 'https://music-player-backend-3xoo.onrender.com';

export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/signup`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
  }
};

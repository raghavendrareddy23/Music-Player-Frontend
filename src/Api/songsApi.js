import axios from 'axios';

const API_BASE_URL = 'https://music-player-backend-3xoo.onrender.com';

export const fetchAllSongs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all songs:', error);
  }
};

export const fetchNewSongs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs/newSongs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching new songs:', error);
  }
};

export const fetchPopularSongs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs/popularSongs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular songs:', error);
  }
};

export const fetchRecentlyPlayedSongs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs/recentSongs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recently played songs:', error);
  }
};

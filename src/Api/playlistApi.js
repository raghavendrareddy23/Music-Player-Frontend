import axios from 'axios';

const API_BASE_URL = 'https://music-player-backend-3xoo.onrender.com';

export const fetchAllPlaylists = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/playlists/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

export const createPlaylist = async (name, songIds, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/playlists/create`, 
      { name, songIds }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating playlist:', error);
  }
};

export const fetchPlaylistById = async (playlistId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching playlist with ID ${playlistId}:`, error);
    throw error;
  }
};

export const addSongToPlaylist = async (playlistId, songId, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/playlists/add-song`,
      { playlistId, songId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    throw error;
  }
};

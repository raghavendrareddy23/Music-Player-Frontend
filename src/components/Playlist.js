import { useState, useEffect } from 'react';
import { fetchAllPlaylists } from '../Api/playlistApi';

const useFetchPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaylists = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await fetchAllPlaylists(token);
      setPlaylists(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return { playlists, loading, error, refetchPlaylists: fetchPlaylists };
};

export default useFetchPlaylists;

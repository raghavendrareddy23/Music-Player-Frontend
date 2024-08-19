import React, { useState, useEffect } from 'react';
import { fetchPlaylistById, addSongToPlaylist } from '../Api/playlistApi';
import { fetchAllSongs } from '../Api/songsApi';
import Loader from '../components/Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddSongToPlaylist = ({ playlistId }) => {
  const [availableSongs, setAvailableSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(''); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchAvailableSongs = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found. Please log in.');
        }

        const allSongs = await fetchAllSongs();

        if (playlistId) {
          const playlist = await fetchPlaylistById(playlistId, token);
          const playlistSongIds = playlist.songs.map((song) => song._id);

          const filteredSongs = allSongs.filter(
            (song) => !playlistSongIds.includes(song._id)
          );
          setAvailableSongs(filteredSongs);
        } else {
          setAvailableSongs(allSongs);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSongs();
  }, [playlistId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    if (!token) {
      setError('Token not found. Please log in.');
      return;
    }

    if (!selectedSong) {
      setError('Please select a song.');
      return;
    }

    setLoading(true); 
    try {
      await addSongToPlaylist(playlistId, selectedSong, token);
      toast.success('Song added to playlist successfully!');
      setSelectedSong(''); 
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-4xl font-bold dark:text-white mb-8">Add Song to Playlist</h1>
      <form onSubmit={handleSubmit}>
        {loading ? (
          <Loader /> 
        ) : (
          <>
            {Array.isArray(availableSongs) && availableSongs.length > 0 ? (
              <div className="mb-4">
                <label className="block dark:text-white mb-2">
                  Select Song to Add
                </label>
                <select
                  id="song"
                  value={selectedSong}
                  onChange={(e) => setSelectedSong(e.target.value)}
                  className="w-full p-2 border text-black border-gray-300 dark:border-gray-600 rounded"
                  required
                >
                  <option value="">Select a song</option>
                  {availableSongs.map((song) => (
                    <option key={song._id} value={song._id}>
                      {song.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p>No songs available to add.</p>
            )}

            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Song
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AddSongToPlaylist;

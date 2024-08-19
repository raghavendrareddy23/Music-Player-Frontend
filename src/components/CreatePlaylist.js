import React, { useState, useEffect } from 'react';
import { createPlaylist } from '../Api/playlistApi';
import { fetchAllSongs } from '../Api/songsApi';
import Loader from '../components/Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePlaylist = ({ onPlaylistCreated }) => {
  const [name, setName] = useState('');
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const fetchedSongs = await fetchAllSongs();
        setSongs(fetchedSongs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    setLoading(true);
    try {
      await createPlaylist(name, selectedSongs, token);
      toast.success('Playlist created successfully!');
      setName('');
      setSelectedSongs([]);
      
      if (onPlaylistCreated) onPlaylistCreated();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSongSelection = (songId) => {
    setSelectedSongs((prevSelectedSongs) =>
      prevSelectedSongs.includes(songId)
        ? prevSelectedSongs.filter((id) => id !== songId)
        : [...prevSelectedSongs, songId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-4xl font-bold dark:text-white mb-8">Create Playlist</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block dark:text-white mb-2" htmlFor="name">
            Playlist Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 dark:border-gray-600 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block dark:text-white mb-2">
            Select Songs
          </label>
          <div className="max-h-60 overflow-y-auto">
            {songs.map((song) => (
              <div key={song._id} className="mb-2">
                <input
                  type="checkbox"
                  id={song._id}
                  value={song._id}
                  onChange={() => handleSongSelection(song._id)}
                  className="mr-2"
                />
                <label htmlFor={song._id} className=" dark:text-white">
                  {song.title}
                </label>
              </div>
            ))}
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Playlist'}
        </button>
        {loading && <Loader />}
      </form>
    </div>
  );
};

export default CreatePlaylist;

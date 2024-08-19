import React, { useState, useEffect } from 'react';
import useFetchPlaylists from '../components/Playlist';
import CreatePlaylist from '../components/CreatePlaylist';
import AddSongToPlaylist from '../components/AddSongsToPlaylist';
import PlaylistDetails from '../components/PlaylistDetails';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlaylistPage = () => {
  const navigate = useNavigate();
  const { playlists, loading, error, refetchPlaylists } = useFetchPlaylists();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showAddSong, setShowAddSong] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
      setShowLoginMessage(true);
    } else {
      setIsLoggedIn(true);
      setShowLoginMessage(false);
    }
  }, [token]);

  const handleViewPlaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleCreatePlaylist = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      toast.info('Please log in to create a playlist.');
    } else {
      setShowCreatePlaylist(true);
      setShowAddSong(false);
      setSelectedPlaylistId('');
    }
  };

  const handleAddSong = (playlistId) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      toast.info('Please log in to add songs to a playlist.');
    } else {
      setSelectedPlaylistId(playlistId);
      setShowAddSong(true);
      setShowCreatePlaylist(false);
    }
  };

  const handleSongSelect = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
  };

  const handlePlaylistCreated = () => {
    refetchPlaylists();
    setShowCreatePlaylist(false);
  };

  if (loading) return <Loader />;
  if (error) return <p>Error loading playlists: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mb-10">
        {showLoginMessage && (
          <div className="bg-yellow-500 text-black px-4 py-2 rounded mb-8">
            <p>
              Please <a href="/login" className="text-blue-600 underline">log in</a> to access all features.
            </p>
          </div>
        )}

        <h1 className="text-4xl font-bold dark:text-white mb-8">
          Your Playlists
        </h1>

        <div className="mb-4">
          <button
            onClick={handleCreatePlaylist}
            className="bg-green-500 text-white px-4 py-2 rounded mr-4"
          >
            Create New Playlist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="border p-4 rounded shadow dark:bg-gray-800 dark:border-gray-600">
              <h2 className="text-2xl font-semibold dark:text-white mb-2">
                {playlist.name}
              </h2>
              <button
                onClick={() => handleViewPlaylist(playlist._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                View Playlist
              </button>
              <button
                onClick={() => handleAddSong(playlist._id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Add Song
              </button>
            </div>
          ))}
        </div>

        {/* Conditional rendering for different actions */}
        {showCreatePlaylist && <CreatePlaylist onPlaylistCreated={handlePlaylistCreated} />}
        {showAddSong && selectedPlaylistId && (
          <AddSongToPlaylist playlistId={selectedPlaylistId} />
        )}

        {selectedPlaylistId && !showCreatePlaylist && !showAddSong && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold dark:text-white mb-4">
              Playlist Details
            </h2>
            <PlaylistDetails
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
            />
          </div>
        )}

        {showLoginPrompt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Login Required</h2>
              <p className="mb-4">Please <a href="/login" className="text-blue-400 underline">log in</a> to create a playlist or add songs.</p>
              <button
                onClick={handleLoginPromptClose}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default PlaylistPage;

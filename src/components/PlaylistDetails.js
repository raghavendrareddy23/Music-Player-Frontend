import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MediaPlayer from "./MusicPlayer"; 
import Footer from "./Footer";
import Header from "./Header"; 
import { fetchPlaylistById } from "../Api/playlistApi";
import Loader from "../components/Loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      setLoading(true); // Start loading
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('User not authenticated.');
        }
        const data = await fetchPlaylistById(playlistId, token);
        setPlaylist(data);
        setError(null); // Clear previous errors
      } catch (err) {
        console.error('Error fetching playlist details:', err);
        setError('Failed to load playlist. Please try again later.');
        toast.error('Failed to load playlist. Please try again later.'); // Show toast notification
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPlaylistDetails();
  }, [playlistId]);

  const handlePlayAll = () => {
    if (playlist && playlist.songs.length > 0) {
      setCurrentSong(playlist.songs[0]);
      setCurrentSongIndex(0);
      setIsPlaying(true); 
    }
  };

  const handleSongSelect = (song) => {
    setCurrentSong(song);
    setCurrentSongIndex(playlist.songs.indexOf(song));
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * playlist.songs.length);
      setCurrentSong(playlist.songs[randomIndex]);
      setCurrentSongIndex(randomIndex);
    } else {
      const nextIndex = (currentSongIndex + 1) % playlist.songs.length;
      setCurrentSong(playlist.songs[nextIndex]);
      setCurrentSongIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    const prevIndex =
      (currentSongIndex - 1 + playlist.songs.length) % playlist.songs.length;
    setCurrentSong(playlist.songs[prevIndex]);
    setCurrentSongIndex(prevIndex);
  };

  const handleShuffle = () => {
    setIsShuffling((prev) => !prev);
  };

  const handleEnd = () => {
    const isLastSong = currentSongIndex === playlist.songs.length - 1;
    if (isLastSong) {
      if (isShuffling) {
        handleNext(); 
      } else {
        setIsPlaying(false); 
      }
    } else {
      handleNext(); 
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading) return <Loader />; // Show loader while loading data
  if (!playlist) return <p className="text-white">Loading playlist...</p>;

  return (
    <div className="flex flex-col">
      <ToastContainer />
      <Header />
      <main className="flex-grow container mx-auto py-8 mb-16">
        <h3 className="text-xl font-bold mb-4 text-white">{playlist.name}</h3>
        <button
          onClick={handlePlayAll}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Play All
        </button>
        <table className="w-full border border-gray-300 dark:border-gray-600 bg-gray-800 dark:bg-gray-900 text-white">
          <thead>
            <tr className="bg-gray-700 dark:bg-gray-800">
              <th className="border-b p-2 text-left">Poster</th>
              <th className="border-b p-2 text-left">Song Name</th>
              <th className="border-b p-2 text-left">Artist</th>
              <th className="border-b p-2 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            {playlist.songs.map((song) => (
              <tr
                key={song._id}
                className="hover:bg-gray-600 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSongSelect(song)}
              >
                <td className="border-b p-2">
                  <img
                    src={song.posterUrl}
                    alt={song.title}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="border-b p-2">{song.title}</td>
                <td className="border-b p-2">{song.artist}</td>
                <td className="border-b p-2">
                  {formatDuration(song.duration)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Media Player */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800">
            <MediaPlayer
              song={currentSong}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onShuffle={handleShuffle}
              isShuffling={isShuffling} 
              onEnd={handleEnd} 
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PlaylistDetails;

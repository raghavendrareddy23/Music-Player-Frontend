import React, { useState, useEffect } from "react";
import {
  fetchAllSongs,
  fetchNewSongs,
  fetchPopularSongs,
  fetchRecentlyPlayedSongs,
} from "../Api/songsApi.js";
import Home from "../components/Home";
import MediaPlayer from "../components/MusicPlayer";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/Hero";
import Loader from "../components/Loader"; 
import axios from "axios";

const HomePage = () => {
  const [allSongs, setAllSongs] = useState([]);
  const [newSongs, setNewSongs] = useState([]);
  const [popularSongs, setPopularSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongsData = async () => {
      try {
        const allSongsData = await fetchAllSongs();
        const newSongsData = await fetchNewSongs();
        const popularSongsData = await fetchPopularSongs();
        const recentSongsData = await fetchRecentlyPlayedSongs();

        setAllSongs(allSongsData || []);
        setNewSongs(newSongsData || []);
        setPopularSongs(popularSongsData || []);
        setRecentSongs(recentSongsData || []);
      } catch (error) {
        console.error("Error fetching songs data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongsData();
  }, []);

  const playSong = (songId) => {
    const song = [
      ...allSongs,
      ...newSongs,
      ...popularSongs,
      ...recentSongs,
    ].find((s) => s._id === songId);
    setCurrentSong(song);
    setIsPlaying(true);

    axios.post(`https://music-player-backend-3xoo.onrender.com/play/${songId}`);
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const playNextSong = () => {
    const allSongList = [
      ...allSongs,
      ...newSongs,
      ...popularSongs,
      ...recentSongs,
    ];
    const currentIndex = allSongList.findIndex(
      (s) => s._id === currentSong._id
    );
    let nextSong;

    if (isShuffling) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allSongList.length);
      } while (randomIndex === currentIndex && allSongList.length > 1);
      nextSong = allSongList[randomIndex];
    } else {
      const nextIndex = (currentIndex + 1) % allSongList.length;
      nextSong = allSongList[nextIndex];
    }

    playSong(nextSong._id);
  };

  const playPreviousSong = () => {
    const allSongList = [
      ...allSongs,
      ...newSongs,
      ...popularSongs,
      ...recentSongs,
    ];
    const currentIndex = allSongList.findIndex(
      (s) => s._id === currentSong._id
    );
    const previousIndex =
      (currentIndex - 1 + allSongList.length) % allSongList.length;
    playSong(allSongList[previousIndex]._id);
  };

  const toggleShuffle = () => setIsShuffling(!isShuffling);

  return (
    <div className="bg-gray-800 flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        {loading ? (
          <Loader /> 
        ) : (
          <div className="mx-auto py-10 dark:bg-gray-800 rounded-lg shadow-lg bg-gray-900">
            <Home
              allSongs={allSongs}
              newSongs={newSongs}
              popularSongs={popularSongs}
              recentSongs={recentSongs}
              onPlay={playSong}
            />
          </div>
        )}
      </main>
      {currentSong && (
        <MediaPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onNext={playNextSong}
          onPrevious={playPreviousSong}
          onShuffle={toggleShuffle}
          isShuffling={isShuffling}
        />
      )}
      <Footer />
    </div>
  );
};

export default HomePage;

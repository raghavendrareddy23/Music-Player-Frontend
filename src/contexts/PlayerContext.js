import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the PlayerContext
export const PlayerContext = createContext();

// Create a custom hook for easy access to the context
export const usePlayer = () => useContext(PlayerContext);

// Create a Provider component
export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const playSong = useCallback((song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  const pauseSong = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffling(prev => !prev);
  }, []);

  const contextValue = {
    currentSong,
    isPlaying,
    isShuffling,
    playSong,
    pauseSong,
    togglePlayPause,
    toggleShuffle,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

import React, { useRef, useEffect, useState } from "react";
import {
  FaPause,
  FaPlay,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeDown,
  FaRandom,
  FaFastForward,
  FaFastBackward,
} from "react-icons/fa";

const MediaPlayer = ({
  song,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffle,
  isShuffling,
}) => {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const resumeTimeKey = `resumeTime_${song._id}`;
      const resumeTime = sessionStorage.getItem(resumeTimeKey);
      audio.currentTime = resumeTime ? parseFloat(resumeTime) : 0;

      if (isPlaying) {
        setLoading(true); 
        setTimeout(() => {
          setLoading(false);
          audio.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
        }, 500); 
      } else {
        audio.pause();
      }
    }

    return () => {
      if (audio) {
        const resumeTimeKey = `resumeTime_${song._id}`;
        sessionStorage.setItem(resumeTimeKey, audio.currentTime);
        audio.pause();
      }
    };
  }, [isPlaying, song]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      const resumeTimeKey = `resumeTime_${song._id}`;
      sessionStorage.removeItem(resumeTimeKey);
      if (audioRef.current && !audioRef.current.loop) {
        onNext();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onNext, song._id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const handleVolumeChange = (change) => {
    setVolume((prevVolume) => {
      const newVolume = Math.max(0, Math.min(1, prevVolume + change));
      return newVolume;
    });
  };

  const handleSkip = (seconds) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, audio.duration));
      setCurrentTime(audio.currentTime);
    }
  };

  const handleShuffle = () => {
    onShuffle();
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgressChange = (event) => {
    const newTime = (event.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePlayPause = () => {
    setLoading(true); 
    setTimeout(() => {
      setLoading(false);
      onPlayPause();
    }, 1); 
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case " ":
        event.preventDefault();
        handlePlayPause();
        break;
      case "ArrowRight":
        event.preventDefault();
        onNext();
        break;
      case "ArrowLeft":
        event.preventDefault();
        onPrevious();
        break;
      case "s":
        event.preventDefault();
        handleShuffle();
        break;
      case "+":
        event.preventDefault();
        handleVolumeChange(0.1);
        break;
      case "-":
        event.preventDefault();
        handleVolumeChange(-0.1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white shadow-lg py-4 z-50">
      <div
        className="container mx-auto px-4 flex flex-col items-center justify-center md:w-4/5 lg:w-3/5 xl:w-3/5"
        tabIndex="0"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-center w-full mb-2">
          <img
            src={song.posterUrl}
            alt={song.title}
            className="w-16 h-16 object-cover rounded-md mr-4"
          />
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">{song.title}</h3>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center space-x-4">
            <button onClick={() => handleSkip(-5)}>
              <FaFastBackward className="text-xl" /> 
            </button>
            <button onClick={onPrevious}>
              <FaStepBackward className="text-xl" />
            </button>
            <button onClick={handlePlayPause}>
              {loading ? (
                <div className="loader" /> 
              ) : isPlaying ? (
                <FaPause className="text-2xl" />
              ) : (
                <FaPlay className="text-2xl" />
              )}
            </button>
            <button onClick={onNext}>
              <FaStepForward className="text-xl" />
            </button>
            <button onClick={() => handleSkip(5)}>
              <FaFastForward className="text-xl" /> 
            </button>
            <button onClick={() => handleVolumeChange(-0.1)}>
              <FaVolumeDown className="text-xl" />
            </button>
            <span className="text-sm ml-2 mr-2">
              {Math.round(volume * 100)}%
            </span>
            <button onClick={() => handleVolumeChange(0.1)}>
              <FaVolumeUp className="text-xl" />
            </button>
            <button
              onClick={handleShuffle}
              className={isShuffling ? "text-blue-400" : ""}
            >
              <FaRandom className="text-xl" />
            </button>
          </div>
          <div className="w-full flex items-center mt-2">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="w-full mx-2"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleProgressChange}
            />
            <span className="text-sm">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={song.songUrl} />
      <style jsx>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #ffffff;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MediaPlayer;

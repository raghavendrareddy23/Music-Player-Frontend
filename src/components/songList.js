import React from 'react';
import { FaPlay } from 'react-icons/fa';

const SongList = ({ songs, onPlay }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {songs.map((song) => (
      <div
        key={song._id}
        className="relative cursor-pointer group bg-gray-900 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
        onClick={() => onPlay(song._id)}
      >
        <img
          src={song.posterUrl}
          alt={song.title}
          className="w-full h-32 object-cover rounded-md"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FaPlay className="text-white text-4xl" />
        </div>
        <h3 className="text-white mt-2 text-lg font-semibold group-hover:text-blue-400 transition-colors duration-300">
          {song.title}
        </h3>
        <p className="text-gray-400 group-hover:text-blue-200 transition-colors duration-300">
          {song.artist}
        </p>
      </div>
    ))}
  </div>
);

export default SongList;

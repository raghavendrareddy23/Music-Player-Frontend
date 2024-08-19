import React, { useState, useEffect } from 'react';
import SongList from './songList';

const Section = ({ title, songs, onPlay }) => {
  const [showAll, setShowAll] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(6);

  const updateItemsToShow = () => {
    if (window.innerWidth >= 1024) {
      setItemsToShow(6);
    } else if (window.innerWidth >= 640) {
      setItemsToShow(3);
    } else {
      setItemsToShow(1); 
    }
  };

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow); 

    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  const displayedSongs = showAll ? songs : songs.slice(0, itemsToShow);

  const handleToggleShowAll = () => setShowAll(!showAll);

  return (
    <section className="text-white p-4 rounded-lg mb-8 bg-gray-800 border-gray-300 dark:border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {songs.length > itemsToShow && (
          <button
            className="text-blue-400 hover:text-blue-300"
            onClick={handleToggleShowAll}
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <SongList songs={displayedSongs} onPlay={onPlay} />
      </div>
    </section>
  );
};

export default Section;

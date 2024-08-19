import React from 'react';
import Section from './section';

const Home = ({ allSongs, newSongs, popularSongs, recentSongs, onPlay }) => {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Music Library</h1>
      <Section title="All Songs" songs={allSongs} onPlay={onPlay} />
      <Section title="New Songs" songs={newSongs} onPlay={onPlay} />
      <Section title="Popular Songs" songs={popularSongs} onPlay={onPlay} />
      <Section title="Recently Played" songs={recentSongs} onPlay={onPlay} />
    </div>
  );
};

export default Home;

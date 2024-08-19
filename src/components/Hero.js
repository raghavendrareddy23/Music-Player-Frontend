import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative h-[50vh] md:h-[60vh] py-12 flex items-center justify-center bg-hero-pattern bg-cover bg-center text-white">
      {/* Background Image with Music Symbols */}
      <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-50"></div>

      {/* Container for content */}
      <div className="relative container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="w-full md:w-2/3 text-center md:text-right">
          <h1 className="text-4xl md:text-6xl text-yellow-400 font-extrabold mb-4 shadow-md">Unleash Your Music</h1>
          <p className="text-xl md:text-4xl font-bold text-green-500">Experience the best beats</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

// components/Loader.js
import React from 'react';

const Loader = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
    <div className="animate-spin border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full"></div>
  </div>
);

export default Loader;

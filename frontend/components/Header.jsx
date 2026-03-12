import React from 'react';

const Header = () => {
  return (
    <header className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
        Anime & Manga Recommender
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Discover your next favorite anime or manga with our AI-powered recommendation system
      </p>
    </header>
  );
};

export default Header;

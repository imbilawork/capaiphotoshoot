
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
        AI Cap & Logo Photoshoot
      </h1>
      <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
        Generate professional product shots for your custom headwear in seconds.
      </p>
    </header>
  );
};

export default Header;

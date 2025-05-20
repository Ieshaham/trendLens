import React, { useState } from 'react';

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-500 py-6 px-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <svg className="w-8 h-8 text-white mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          <h1 className="text-2xl md:text-3xl font-bold text-white">TrendLens</h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative mb-4 md:mb-0 md:mr-4">
            <input 
              type="text" 
              placeholder="Search trends..."
              value={searchTerm}
              onChange={handleSearch}
              className="bg-white bg-opacity-20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <svg className="w-5 h-5 text-white absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex space-x-4">
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Latest Trends
            </button>
            <button className="bg-transparent border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors">
              Compare
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
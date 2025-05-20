import React, { useState } from 'react';

const TrendCard = ({ trend, isSelected, onSelect, onRequestAIAnalysis }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate current popularity (last data point)
  const currentPopularity = trend.popularity[trend.popularity.length - 1].score;
  
  // Calculate trend direction by comparing with previous month
  const previousPopularity = trend.popularity[trend.popularity.length - 2].score;
  const trendDirection = currentPopularity > previousPopularity ? 'up' : 
                        currentPopularity < previousPopularity ? 'down' : 'stable';
  const trendDifference = Math.abs(currentPopularity - previousPopularity);
  
  // Determine the trend color for direction indicators
  const directionColor = trendDirection === 'up' ? 'text-green-500' : 
                         trendDirection === 'down' ? 'text-red-500' : 'text-gray-500';
  
  // Direction icon based on trend
  const directionIcon = trendDirection === 'up' ? (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
    </svg>
  ) : trendDirection === 'down' ? (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M18 10a1 1 0 01-1 1H3a1 1 0 110-2h14a1 1 0 011 1z" clipRule="evenodd" />
    </svg>
  );

  const handleAIAnalysis = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onRequestAIAnalysis(trend.id);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-md transition-all duration-300 overflow-hidden ${isSelected ? 'ring-2 ring-purple-500' : ''}`}>
      <div 
        className="absolute top-3 right-3 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center"
        onClick={() => onSelect(trend.id)}
      >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img 
          src={trend.image || `/api/placeholder/400/320`} 
          alt={trend.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white text-xl font-bold">{trend.name}</h3>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold">{currentPopularity}%</div>
            <div className={`flex items-center ml-2 ${directionColor}`}>
              {directionIcon}
              <span className="text-sm ml-1">{trendDifference}%</span>
            </div>
          </div>
          
          <div className="px-3 py-1 rounded-full text-xs font-medium" 
            style={{ backgroundColor: `${trend.color}20`, color: trend.color }}>
            {currentPopularity > 80 ? 'Hot Trend' : 
             currentPopularity > 60 ? 'Popular' : 
             currentPopularity > 40 ? 'Growing' : 'Declining'}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{trend.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {trend.keyItems && trend.keyItems.slice(0, 3).map((item, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              {item}
            </span>
          ))}
          {trend.keyItems && trend.keyItems.length > 3 && (
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              +{trend.keyItems.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            className="text-sm text-purple-600 font-medium focus:outline-none"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          
          <button 
            onClick={handleAIAnalysis}
            disabled={isLoading}
            className={`flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium ${
              isLoading ? 'bg-gray-200 text-gray-500' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
            } transition-colors`}
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                AI Analysis
              </>
            )}
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-2">AI Analysis</h4>
            <p className="text-sm text-gray-600">{trend.aiAnalysis || "No AI analysis available. Click 'AI Analysis' to generate insights."}</p>
            
            {trend.keyItems && trend.keyItems.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold text-gray-800 mb-2">Key Items</h4>
                <ul className="text-sm text-gray-600">
                  {trend.keyItems.map((item, index) => (
                    <li key={index} className="flex items-center mb-1">
                      <svg className="w-3 h-3 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendCard;
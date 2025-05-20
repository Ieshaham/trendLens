import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LineChart from './components/LineChart';
import TrendCard from './components/TrendCard';
import trendData from './data/trends.json';
import './index.css';

const App = () => {
  const [trends, setTrends] = useState([]);
  const [selectedTrends, setSelectedTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      setTrends(trendData.trends);
      // Auto-select the top 3 trends by current popularity
      const sortedTrends = [...trendData.trends].sort((a, b) => {
        const aCurrentPopularity = a.popularity[a.popularity.length - 1].score;
        const bCurrentPopularity = b.popularity[b.popularity.length - 1].score;
        return bCurrentPopularity - aCurrentPopularity;
      });
      
      setSelectedTrends(sortedTrends.slice(0, 3).map(trend => trend.id));
      setLoading(false);
    }, 1000);
  }, []);

  const handleTrendSelection = (trendId) => {
    setSelectedTrends(prev => {
      if (prev.includes(trendId)) {
        return prev.filter(id => id !== trendId);
      } else {
        // Limit to max 5 trends for better visualization
        if (prev.length >= 5) {
          return [...prev.slice(1), trendId];
        }
        return [...prev, trendId];
      }
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredTrends = trends.filter(trend => {
    const matchesSearch = trend.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trend.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'popular') {
      const currentPopularity = trend.popularity[trend.popularity.length - 1].score;
      return matchesSearch && currentPopularity >= 80;
    }
    if (selectedTab === 'growing') {
      const currentPopularity = trend.popularity[trend.popularity.length - 1].score;
      const previousPopularity = trend.popularity[trend.popularity.length - 2].score;
      return matchesSearch && currentPopularity > previousPopularity;
    }
    if (selectedTab === 'declining') {
      const currentPopularity = trend.popularity[trend.popularity.length - 1].score;
      const previousPopularity = trend.popularity[trend.popularity.length - 2].score;
      return matchesSearch && currentPopularity < previousPopularity;
    }
    
    return matchesSearch;
  });

  const requestAIAnalysis = async (trendId) => {
    // Simulate calling OpenAI API
    setAiExplanation('');
    
    const selectedTrend = trends.find(trend => trend.id === trendId);
    if (!selectedTrend) return;
    
    try {
      // In a real implementation, this would be an actual API call to OpenAI
      // For now, we'll use the pre-defined aiAnalysis from our data
      // But let's simulate an API call
      
      setTimeout(() => {
        setAiExplanation(selectedTrend.aiAnalysis);
        
        // Update the trend in our state with the new AI analysis
        setTrends(trends.map(trend => {
          if (trend.id === trendId) {
            return { ...trend, aiAnalysis: selectedTrend.aiAnalysis };
          }
          return trend;
        }));
      }, 1500);
      
    } catch (error) {
      console.error("Error getting AI analysis:", error);
      setAiExplanation("Sorry, there was an error generating the AI analysis. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8">
        {/* AI Insights Panel */}
        {aiExplanation && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-8 relative">
            <button 
              onClick={() => setAiExplanation('')}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">AI Trend Analysis</h2>
                <p className="text-gray-700">{aiExplanation}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Chart */}
        {selectedTrends.length > 0 ? (
          <LineChart trends={trends} selectedTrends={selectedTrends} />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center">
            <p className="text-gray-500">Select at least one trend to view the chart</p>
          </div>
        )}
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`py-3 px-6 font-medium ${selectedTab === 'all' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSelectedTab('all')}
          >
            All Trends
          </button>
          <button 
            className={`py-3 px-6 font-medium ${selectedTab === 'popular' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSelectedTab('popular')}
          >
            Popular
          </button>
          <button 
            className={`py-3 px-6 font-medium ${selectedTab === 'growing' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSelectedTab('growing')}
          >
            Growing
          </button>
          <button 
            className={`py-3 px-6 font-medium ${selectedTab === 'declining' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSelectedTab('declining')}
          >
            Declining
          </button>
        </div>
        
        {/* Trend Cards Grid */}
        {filteredTrends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrends.map(trend => (
              <TrendCard 
                key={trend.id}
                trend={trend}
                isSelected={selectedTrends.includes(trend.id)}
                onSelect={handleTrendSelection}
                onRequestAIAnalysis={requestAIAnalysis}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No trends found</h3>
            <p className="mt-1 text-sm text-gray-500">Try changing your search query or filter selection.</p>
          </div>
        )}
      </main>
      
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 TrendLens - Fashion Trend Analytics</p>
            <p className="mt-2">Powered by React, Chart.js and OpenAI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
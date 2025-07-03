'use client';

import { useState } from 'react';
import SearchResults from './SearchResults';

export default function SearchCard() {
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setSearchResults(null);
    setRecommendations(null);
    
    try {
      console.log('Searching for:', query, 'at branch:', branch);
      
      // Perform library search and get recommendations in parallel
      const [searchResponse, recommendationsResponse] = await Promise.all([
        fetchAPI('/api/search', { query, branch }),
        fetchAPI('/api/recommendations', { query })
      ]);

      if (searchResponse.error) {
        throw new Error(searchResponse.error);
      }

      setSearchResults(searchResponse);
      
      if (recommendationsResponse && !recommendationsResponse.error) {
        setRecommendations(recommendationsResponse);
      } else {
        console.warn('Recommendations failed:', recommendationsResponse?.error || 'Unknown error');
      }

    } catch (error) {
      console.error('Search error:', error);
      setError(error.message || 'Failed to search library catalogue');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to safely fetch and parse JSON
  const fetchAPI = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return result;
    } catch (error) {
      if (error.message.includes('Unexpected token')) {
        throw new Error('Server returned an invalid response. Please try again.');
      }
      throw error;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
  };

  if (searchResults) {
    return (
      <div className="space-y-6">
        {/* Search Again Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for books, authors, subjects..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Any branch</option>
              <option value="central">Toronto Reference Library</option>
              <option value="north-york">North York Central Library</option>
              <option value="scarborough">Scarborough Civic Centre</option>
              <option value="etobicoke">Etobicoke Civic Centre</option>
              {/* Add more branches as needed */}
            </select>
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search Results */}
        <SearchResults 
          results={searchResults} 
          recommendations={recommendations}
          query={query}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-white/95">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800">Search Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Main Search Input */}
        <div className="relative">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            What do you want to read?
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for books, authors, subjects..."
              className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Branch Selector */}
        <div className="relative">
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Library Branch (Optional)
          </label>
          <select
            id="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            <option value="">Any branch</option>
            <option value="central">Toronto Reference Library</option>
            <option value="north-york">North York Central Library</option>
            <option value="scarborough">Scarborough Civic Centre</option>
            <option value="etobicoke">Etobicoke Civic Centre</option>
            <option value="beaches">Beaches</option>
            <option value="bloor-gladstone">Bloor/Gladstone</option>
            <option value="college-shaw">College/Shaw</option>
            <option value="distillery">Distillery District</option>
            <option value="fort-york">Fort York</option>
            <option value="harbourfront">Harbourfront</option>
            <option value="high-park">High Park</option>
            <option value="junction">Junction</option>
            <option value="leslieville">Leslieville</option>
            <option value="liberty-village">Liberty Village</option>
            <option value="pape-danforth">Pape/Danforth</option>
            <option value="parliament">Parliament</option>
            <option value="queen-saulter">Queen/Saulter</option>
            <option value="riverdale">Riverdale</option>
            <option value="runnymede">Runnymede</option>
            <option value="st-lawrence">St. Lawrence</option>
            <option value="toronto-reference">Toronto Reference Library</option>
            <option value="york-woods">York Woods</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Searching Library...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Library
            </>
          )}
        </button>
      </form>

      {/* Quick Suggestions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
        <div className="flex flex-wrap gap-2">
          {['Fiction bestsellers', 'Local history', 'Programming books', 'Graphic novels', 'Poetry'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 
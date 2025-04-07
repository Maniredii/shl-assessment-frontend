import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/recommend`, {
        query: query
      });
      // Handle response
      console.log(response.data);
    } catch (err) {
      setError('An error occurred while fetching recommendations. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query..."
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendations'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default SearchBar;
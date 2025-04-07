import React, { useState } from 'react';
import axios from 'axios';

const SearchForm = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://shl-assessment-backend.vercel.app/api/recommend', {
        query: query
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      console.log(response.data);
    } catch (error) {
      setError('An error occurred while fetching recommendations. Please try again.');
      console.error('Error:', error);
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
      <button type="submit">GET RECOMMENDATIONS</button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default SearchForm;
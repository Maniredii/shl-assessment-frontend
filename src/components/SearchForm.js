import React, { useState } from 'react';
import axios from 'axios';
import './SearchForm.css';

const SearchForm = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://shl-assessmentss.vercel.app/api/recommend', {
        query: query
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setRecommendations(response.data.recommendations);
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('API Error:', error);
      setError('An error occurred while fetching recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query..."
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Loading...' : 'GET RECOMMENDATIONS'}
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {recommendations.length > 0 && (
        <div className="recommendations">
          <h3>Recommended Assessments:</h3>
          {recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <h4>{rec.title}</h4>
              <p>{rec.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchForm;
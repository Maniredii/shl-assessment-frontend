import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchForm.css';

const SearchForm = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [backendStatus, setBackendStatus] = useState(false);

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await axios.get('https://shl-assessmentss.vercel.app/');
      setBackendStatus(response.data.status === 'success');
    } catch (error) {
      console.error('Backend status check failed:', error);
      setBackendStatus(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Sending query:', query); // Debug log
      const response = await axios.post('https://shl-assessmentss.vercel.app/api/recommend', {
        query: query
      });
      
      console.log('Backend response:', response.data); // Debug log
      
      if (response.data.status === 'success' && response.data.recommendations) {
        setRecommendations(response.data.recommendations);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('API Error:', error);
      setError(`Error: ${error.response?.data?.message || 'Failed to fetch recommendations'}`);
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

      <div className="backend-status">
        Backend Status: {backendStatus ? '✅ Connected' : '❌ Not Connected'} 
        <br />
        <a href="https://shl-assessmentss.vercel.app/" target="_blank" rel="noopener noreferrer">
          Check backend server status
        </a>
      </div>

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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchForm.css';

const API_BASE_URL = 'https://shl-assessmentss.vercel.app';

const SearchForm = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [backendStatus, setBackendStatus] = useState(false);

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      setBackendStatus(response.data.status === 'healthy');
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendStatus(false);
    }
  };

  const fetchRecommendations = async (searchQuery) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/recommend`, {
        query: searchQuery
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('API Response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('API Error Details:', error.response || error); // Enhanced error logging
      throw new Error(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!query.trim()) {
      setError('Please enter a search query');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchRecommendations(query);
      if (data && data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        throw new Error('No recommendations found');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      setError(error.message);
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
        We are having trouble connecting frontend and backend. 
        <br />
        Check the backend here: <a href="https://shl-assessmentss.vercel.app/" target="_blank" rel="noopener noreferrer">Backend Status</a>
        <br />
        View full project code: <a href="https://github.com/Maniredii/SHL-Assessment-Recommendation-System.git" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
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
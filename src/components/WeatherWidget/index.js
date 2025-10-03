import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('New York');

  // Using OpenWeatherMap API (you'll need to get a free API key)
  const API_KEY = 'demo'; // Replace with actual API key
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For demo purposes, using mock data since API key is not provided
      // In real implementation, uncomment the fetch call below
      /*
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Weather data not available');
      const data = await response.json();
      */
      
      // Mock weather data for demo
      const data = {
        name: location,
        main: {
          temp: Math.floor(Math.random() * 30) + 5,
          feels_like: Math.floor(Math.random() * 30) + 5,
          humidity: Math.floor(Math.random() * 40) + 40
        },
        weather: [{
          main: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
          description: 'clear sky',
          icon: '01d'
        }],
        wind: {
          speed: Math.floor(Math.random() * 10) + 1
        }
      };
      
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const handleLocationChange = (e) => {
    e.preventDefault();
    const newLocation = e.target.location.value.trim();
    if (newLocation) {
      setLocation(newLocation);
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'Sunny': '☀️',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Snowy': '❄️'
    };
    return icons[condition] || '🌤️';
  };

  if (loading) {
    return (
      <div className="weather-widget">
        <div className="weather-header">
          <h3>🌤️ Weather</h3>
        </div>
        <div className="weather-loading">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget">
        <div className="weather-header">
          <h3>🌤️ Weather</h3>
        </div>
        <div className="weather-error">
          <p>Unable to load weather data</p>
          <button onClick={fetchWeather} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3>🌤️ Weather</h3>
        <button onClick={fetchWeather} className="refresh-btn" title="Refresh weather">
          🔄
        </button>
      </div>
      
      <form onSubmit={handleLocationChange} className="location-form">
        <input
          type="text"
          name="location"
          placeholder="Enter city name"
          className="location-input"
        />
        <button type="submit" className="location-btn">Go</button>
      </form>

      {weather && (
        <div className="weather-content">
          <div className="weather-main">
            <div className="weather-icon">
              {getWeatherIcon(weather.weather[0].main)}
            </div>
            <div className="weather-temp">
              <span className="temp">{Math.round(weather.main.temp)}°C</span>
              <span className="location-name">{weather.name}</span>
            </div>
          </div>
          
          <div className="weather-details">
            <div className="weather-item">
              <span className="label">Feels like:</span>
              <span className="value">{Math.round(weather.main.feels_like)}°C</span>
            </div>
            <div className="weather-item">
              <span className="label">Humidity:</span>
              <span className="value">{weather.main.humidity}%</span>
            </div>
            <div className="weather-item">
              <span className="label">Wind:</span>
              <span className="value">{weather.wind.speed} m/s</span>
            </div>
            <div className="weather-item">
              <span className="label">Condition:</span>
              <span className="value">{weather.weather[0].main}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';
import { getWeatherData, validateLocation, formatTemperature, getWeatherIcon } from '../../services/weatherService';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('New York');

  // You can set your OpenWeatherMap API key here
  const API_KEY = 'demo'; // Replace with actual API key

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!validateLocation(location)) {
        throw new Error('Please enter a valid city name');
      }
      
      const data = await getWeatherData(location, API_KEY);
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
    if (validateLocation(newLocation)) {
      setLocation(newLocation);
    } else {
      setError('Please enter a valid city name');
    }
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
              <span className="temp">{formatTemperature(weather.main.temp)}</span>
              <span className="location-name">{weather.name}</span>
            </div>
          </div>
          
          <div className="weather-details">
            <div className="weather-item">
              <span className="label">Feels like:</span>
              <span className="value">{formatTemperature(weather.main.feels_like)}</span>
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
import { apiGet } from '../utils/apiHelper';

// Mock weather data for demo purposes
const generateMockWeatherData = (location) => {
  return {
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
};

export const getWeatherData = async (location, apiKey = 'demo') => {
  try {
    // If using demo API key, return mock data
    if (apiKey === 'demo' || !apiKey) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateMockWeatherData(location);
    }

    // Real API call (uncomment when you have a valid API key)
    /*
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    */

    // For now, return mock data
    return generateMockWeatherData(location);
    
  } catch (error) {
    console.error('Weather service error:', error);
    throw new Error('Unable to fetch weather data');
  }
};

export const validateLocation = (location) => {
  if (!location || typeof location !== 'string') {
    return false;
  }
  
  const trimmed = location.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
};

export const formatTemperature = (temp, unit = 'C') => {
  const rounded = Math.round(temp);
  return `${rounded}°${unit}`;
};

export const getWeatherIcon = (condition) => {
  const icons = {
    'Sunny': '☀️',
    'Clear': '☀️',
    'Cloudy': '☁️',
    'Clouds': '☁️',
    'Rainy': '🌧️',
    'Rain': '🌧️',
    'Snowy': '❄️',
    'Snow': '❄️',
    'Thunderstorm': '⛈️',
    'Drizzle': '🌦️',
    'Mist': '🌫️',
    'Fog': '🌫️'
  };
  return icons[condition] || '🌤️';
};
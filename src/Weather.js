import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';

import './index.css';


const ForecastItem = ({ icon, day, temperature }) => {
  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 200, friction: 20 },
  });

  return (
    <animated.div
      style={props}
      className="text-center glass-effect2 p-6 rounded-lg"
    >
      <div className="flex flex-col items-center">
        <div className="text-4xl sm:text-5xl">
          {icon ? (
            <img src={icon} alt="weather icon" className="w-12 h-12" />
          ) : (
            <span>☁️</span> // Default icon if none available
          )}
        </div>
        <p className="font-semibold mt-1">{day}</p>
        <p className="text-lg">{temperature}</p>
      </div>
    </animated.div>
  );
}


const Weather = () => {
  const [city, setCity] = useState(''); 
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);
  const apiKey = '05075a669c1b44728f2163025242510'; 
  const inputRef = useRef(null); 


  const fetchWeatherData = async (searchedCity) => {
    try {
 
      setWeatherData(null);
      setForecastData([]);
      setError(null);

      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${searchedCity}&aqi=no`
      );
      setWeatherData(response.data);


      const forecastResponse = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchedCity}&days=4&aqi=no`
      );
      setForecastData(forecastResponse.data.forecast.forecastday);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    }
  };

  
  useEffect(() => {
    if (city) {
      fetchWeatherData(city);
    }
  }, [city]); 

 
  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="background bg-blue-100 min-h-screen flex flex-col items-center relative">
    
      <div className="cloud-animation"></div>


      <div className="absolute top-6 w-full max-w-md mx-auto px-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            ref={inputRef} 
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)} 
            className="w-full p-4 pl-10 pr-4 text-gray-700 bg-white rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a City..."
          />
          <button
            type="submit"
            className="absolute top-0 left-0 mt-4 ml-4 text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 19a8 8 0 100-16 8 8 0 000 16zm5-5l4 4"
              />
            </svg>
          </button>
        </form>
      </div>

    
      {weatherData && (
        <div
          style={{ height: 'auto', maxWidth: '1000px', marginTop: '100px' }}
          className="glass-effect p-6 sm:p-12 rounded-lg shadow-lg max-w-full w-full weather-card mt-8 sm:mt-12"
        >
         
          <div className="flex flex-col sm:flex-row items-center justify-center mt-4">
            <img
              src={weatherData.current.condition.icon}
              alt="Sun"
              className="w-64 h-64 mb-2 sm:mb-0 sm:mr-4"
            />
            <div className="ml-2 text-center">
              <p className="text-lg sm:text-2xl mt-2">Today</p>
              <h1 className="text-4xl sm:text-5xl font-bold">
                {weatherData.location.name}
              </h1>
              <p className="text-lg sm:text-2xl mt-2">
                Temperature: {weatherData.current.temp_c}°C
              </p>
              <p className="text-sm sm:text-lg text-gray-700">
                {weatherData.current.condition.text}
              </p>
             
            </div>
          </div>

        
          <div className="flex flex-wrap justify-around mt-4 sm:mt-19">
            {forecastData.map((day, index) => (
              <ForecastItem
                key={index}
                icon={day.day.condition.icon}
                day={new Date(day.date).toLocaleString('en-US', {
                  weekday: 'short',
                })}
                temperature={`${day.day.avgtemp_c}°C`}
              />
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Weather;

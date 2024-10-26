const axios = require('axios');

const apiKey = '05075a669c1b44728f2163025242510'; // Replace with your OpenWeatherMap API key
const city = 'Lahore'; // Change to any city you want to test

const fetchWeatherData = async () => {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=05075a669c1b44728f2163025242510&q=Lahore&aqi=no`
    );

    if (response.status === 200) {
      console.log('Weather Data:', response.data);
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Error data:', error.response.data);
      console.error(`Error status: ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
  }
};

fetchWeatherData();

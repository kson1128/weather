import axios from 'axios';

const fetchWeatherData = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/api/weather`);

    const responseData = response.data;
    return responseData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export default fetchWeatherData;

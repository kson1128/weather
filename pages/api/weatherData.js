import axios from 'axios';

const fetchWeather = async () => {
  try {
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast?latitude=40.76&longitude=-73.99&hourly=temperature_2m,cloudcover,is_day&daily=temperature_2m_max,temperature_2m_min&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&past_days=5&timezone=America%2FNew_York'
    );

    const responseData = response.data;
    return responseData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export default fetchWeather;

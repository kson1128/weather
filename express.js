const axios = require('axios');
const express = require('express');
const app = express();
const port = 3001;

const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// GET    api/weather
app.get('/api/weather', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast?latitude=40.76&longitude=-73.99&hourly=temperature_2m,precipitation,cloudcover,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&past_days=5&forecast_days=14&timezone=America%2FNew_York'
    );
    const weatherData = response.data;

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching weather data.' });
  }
});

app.post('/api/snapshot', async (req, res) => {});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;

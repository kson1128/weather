const axios = require('axios');
const express = require('express');
const app = express();
const port = 3001;

const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  })
);

// GET    api/weather
app.get('/api/weather', async (req, res) => {
  try {
    // Fetch weather data from the API
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast?latitude=40.76&longitude=-73.99&hourly=temperature_2m,cloudcover,is_day&daily=temperature_2m_max,temperature_2m_min&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&past_days=5&timezone=America%2FNew_York'
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

// app.post('/readings', (req, res) => {
//   const reading = req.body;

//   // Save the reading to a database or storage of your choice
//   // Here, we'll simply log the reading to the console
//   console.log('New reading:', reading);

//   res.sendStatus(201);
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;

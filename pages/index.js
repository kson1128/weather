// import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import Link from '@mui/material/Link';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
import fetchWeatherData from '../pages/api/weather';
import { formatDistanceToNow, format } from 'date-fns';
import HistoryCard from './historyCard';
import HistoryChart from './chart';
import ForecastCard from './forecastCard';
import { toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';

export default function Home() {
  const [data, setData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [localStorageReadings, setLocalStorageReadings] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [displayData, setDisplayData] = useState(false);

  const [toggle, running] = useInterval(async () => {
    const weatherData = await fetchWeatherData();
    console.log('weatherData:-->>', weatherData);
    setData(weatherData);
  }, 60000);

  const displayChart = () => {
    return setDisplayData(() => !displayData);
  };

  useEffect(() => {
    const fetchInitialWeatherData = async () => {
      const weatherData = await fetchWeatherData();
      setData(weatherData);
    };

    fetchInitialWeatherData();
  }, []);

  const precipitationProbability = () => {
    const chance = data?.daily.precipitation_probability_max;
    chance?.map(num => {});
  };

  const getTemperature = () => {
    return data
      ? data.current_weather.temperature + data.daily_units.temperature_2m_max
      : 'Loading...';
  };

  const timestamps = data && data.daily.time;

  const formatDatestamp = timestamp => {
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toLocaleDateString('en-US');
    return `${formattedDate} `;
  };

  const dateStamp =
    data &&
    timestamps
      .slice(0, 5)
      .map((timestamp, index) => formatDatestamp(timestamp));

  const lastMeasurementTimeStamp = data
    ? new Date(data.current_weather.time * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : 'Loading...';

  const getHistoricalData = () => {
    if (data && Array.isArray(data.daily.temperature_2m_max)) {
      return {
        temperature_2m_max: data.daily.temperature_2m_max.slice(0, 5),
        temperature_2m_min: data.daily.temperature_2m_min.slice(0, 5),
      };
    } else {
      return [];
    }
  };

  const forecastData = () => {
    if (data && Array.isArray(data.daily.temperature_2m_max)) {
      return {
        temperature_2m_max: data.daily.temperature_2m_max.slice(6, 13),
        temperature_2m_min: data.daily.temperature_2m_min.slice(6, 13),
      };
    } else {
      return [];
    }
  };
  const forecastDateStamp =
    data &&
    timestamps.slice(5).map((timestamp, index) => formatDatestamp(timestamp));

  const storeSnapshot = () => {
    const snapshot = {
      temperature: data.current_weather.temperature,
      timestamp: data.current_weather.time,
    };
    const existingSnapshots =
      JSON.parse(localStorage.getItem('snapshots')) || [];
    existingSnapshots.push(snapshot);
    localStorage.setItem('snapshots', JSON.stringify(existingSnapshots));

    toast.success('successfully stored snapshot');
  };

  const loadReadings = () => {
    const storedSnapshots = JSON.parse(localStorage.getItem('snapshots'));
    const sortedSnapshots = storedSnapshots.sort(
      (a, b) => b.timestamp - a.timestamp
    );

    const recentSnapshots = sortedSnapshots.slice(0, 5);
    setShowAlert(true);
    setLocalStorageReadings(recentSnapshots);
  };

  let days = data?.daily.time.map(eachTime => {
    return format(new Date(eachTime * 1000), 'EEE');
  });
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Weather Forecast
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 3,
            pb: 3,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h4"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {format(currentTime, 'EEE')} {format(currentTime, 'MM/dd/yyyy')}
              <br />
              Current Temperature:
            </Typography>
            <Typography
              variant="h3"
              align="center"
              color="text.secondary"
              paragraph
            >
              {getTemperature()}
            </Typography>
            <Typography
              variant="h7"
              align="center"
              color="text.secondary"
              paragraph
            >
              Updated: {'  '}
              {formatDistanceToNow(currentTime, { addSuffix: true })}
            </Typography>
            <Stack
              sx={{ pt: 2 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" onClick={toggle}>
                {running ? 'Pause' : 'Resume'}
              </Button>

              {/* <Grid item xs={12}> */}
              <Button variant="contained" onClick={storeSnapshot}>
                Take Snapshot
              </Button>
              {/* </Grid> */}
              <Button variant="contained" onClick={loadReadings}>
                See Snapshots
              </Button>
              {/* Alert box */}
              <SweetAlert
                show={showAlert}
                title="Local Storage Readings"
                onConfirm={() => setShowAlert(false)}
              >
                {Array.isArray(localStorageReadings) ? (
                  localStorageReadings.map((item, index) => (
                    <div
                      key={index}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <span style={{ marginRight: '10px' }}>{index + 1}.</span>
                      <span style={{ marginRight: '10px' }}>Temperature:</span>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '55px',
                          textAlign: 'right',
                          marginRight: '10px',
                        }}
                      >
                        {item.temperature + data.daily_units.temperature_2m_max}
                      </span>
                      <span>Date: {formatDatestamp(item.timestamp)}</span>
                    </div>
                  ))
                ) : (
                  <div>No readings available.</div>
                )}
              </SweetAlert>
            </Stack>
          </Container>
        </Box>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          style={{
            fontWeight: 'bold',
            color: '#333',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            marginTop: '30px',
            marginBottom: '-5px',
          }}
        >
          Past 5-day Weather
        </Typography>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={3}>
            <HistoryCard props={{ getHistoricalData, days, dateStamp, data }} />
          </Grid>
        </Container>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom align="center">
              Historical Chart:
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={displayChart}>
              See Chart
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                display: displayData ? 'block' : 'none',

                justifyContent: 'center',
                alignItems: 'center',
                width: '500px',
                height: '500px',
                marginTop: '16px',
                padding: '16px',
                margin: '10px auto 60px auto',
                // cursor: 'pointer',
                // transition: 'transform 0.3s',
                // '&:hover': {
                //   transform: 'scale(1.1)',
                // },
              }}
            >
              <HistoryChart
                props={{ getHistoricalData, days, dateStamp, data }}
              />
            </Box>
          </Grid>
        </Grid>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          style={{
            fontWeight: 'bold',
            color: '#333',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            marginTop: '30px',
            marginBottom: '-5px',
          }}
        >
          7-Day Forecast
        </Typography>

        <ForecastCard
          props={{
            forecastDateStamp,
            data,
            forecastData,
            days,
            dateStamp,
          }}
        />
      </main>
      {/* Footer */}
      {/* <Box sx={{ bgcolor: 'background.paper', p: 2 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom></Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Created using Next.JS
        </Typography>
      </Box> */}
      {/* End footer */}
    </>
  );
}

function useInterval(callback, delay) {
  const savedCallback = useRef();
  const intervalId = useRef(null);
  const [currentDelay, setDelay] = useState(delay);

  const toggleRunning = useCallback(
    () => setDelay(currentDelay => (currentDelay === null ? delay : null)),
    [delay]
  );

  const clear = useCallback(() => clearInterval(intervalId.current), []);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (intervalId.current) clear();

    if (currentDelay !== null) {
      intervalId.current = setInterval(tick, currentDelay);
    }

    if (currentDelay === null) {
      tick();
    }
    // if (currentDelay !== null) {
    //   intervalId.current = setInterval(tick, currentDelay);
    // }

    return clear;
  }, [currentDelay, clear]);

  return [toggleRunning, !!currentDelay];
}

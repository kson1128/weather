import { useState, useEffect, useRef, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import fetchWeatherData from '../pages/api/weather';

import {
  Paper,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const [data, setData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [localStorageReadings, setLocalStorageReadings] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toastNotification, setToastNotification] = useState(false);

  const [toggle, running] = useInterval(async () => {
    const weatherData = await fetchWeatherData();
    console.log('weatherData:-->>', weatherData);
    setData(weatherData);
  }, 2000);

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
      return data.daily.temperature_2m_max
        .slice(0, 5)
        .map((temp, index) => temp + data.daily_units.temperature_2m_max);
    } else {
      return [];
    }
  };

  const forecastData = () => {
    if (data && Array.isArray(data.daily.temperature_2m_max)) {
      return data.daily.temperature_2m_max
        .slice(5, data.daily.temperature_2m_max.length)
        .map((temp, index) => temp + data.daily_units.temperature_2m_max);
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

  return (
    <Container maxWidth="sm">
      {data && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Current Temperature:
              </Typography>
              <Typography variant="h3" gutterBottom>
                {getTemperature()}
              </Typography>
              {/* <Typography variant="subtitle1">
                Last Updated Time:
                {lastMeasurementTimeStamp}
              </Typography> */}
              <Typography variant="subtitle1">
                Updated:
                {formatDistanceToNow(currentTime, { addSuffix: true })}
              </Typography>
            </Paper>
            <Button variant="contained" onClick={toggle}>
              {running ? 'Pause' : 'Resume'}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Historical Chart:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              {getHistoricalData().map((item, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                      {dateStamp[index]}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Temperature: {item}
                    </Typography>
                  </Grid>
                  {index < getHistoricalData().length - 1 && (
                    <Grid item xs={12}>
                      <Divider sx={{ margin: '16px 0' }} />
                    </Grid>
                  )}
                </Grid>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              7-Day Forecast:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              {forecastData().map((item, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                      {forecastDateStamp[index]}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Temperature: {item}
                    </Typography>
                  </Grid>
                  {index < forecastData().length - 1 && (
                    <Grid item xs={12}>
                      <Divider sx={{ margin: '16px 0' }} />
                    </Grid>
                  )}
                </Grid>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={storeSnapshot}>
              Store Snapshot
            </Button>
            <ToastContainer />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={loadReadings}>
              Show Readings
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
          </Grid>
        </Grid>
      )}
    </Container>
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

    return clear;
  }, [currentDelay, clear]);

  return [toggleRunning, !!currentDelay];
}

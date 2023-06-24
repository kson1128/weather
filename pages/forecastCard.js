import * as React from 'react';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';

import { Grid, Paper } from '@mui/material';

export default function ForecastCard({ props }) {
  let days = props?.days?.slice(5, 12);
  console.log('props in forecast', props);
  return (
    <Grid container key={props.card} xs={12} sm={6} md={14}>
      <Card
        sx={{
          height: '150%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'skyblue',
          position: 'relative;',
          // left: '8%',
          // right: '-4%',
          margin: '5% 1% 5% 2%',
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            marginLeft: '-0.2%',
          }}
        >
          {props.forecastData()['temperature_2m_max']?.map((item, index) => (
            <Grid item xs={1.8} sx={{ padding: '0px' }} key={index}>
              <Card sx={{ height: '100%', width: '88%' }}>
                <Typography variant="body1" gutterBottom>
                  {days[index]} {props.forecastDateStamp[index + 1]}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Temperature:{' '}
                  {item +
                    props.data.daily_units.temperature_2m_max +
                    ' / ' +
                    props.forecastData()['temperature_2m_min'][index] +
                    props.data.daily_units.temperature_2m_max}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Grid>
  );
}

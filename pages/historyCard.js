import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import { Grid, Paper } from '@mui/material';
import styles from '../styles/Home.module.css';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

export default function HistoryCard({ props }) {
  // console.log('props', props.getHistoricalData());
  return (
    <Grid container key={props.card} xs={12} sm={6} md={14}>
      <Card
        sx={{
          height: '110%',
          width: '95%',
          display: 'flex',
          flexDirection: 'column',
          background: 'skyblue',
          position: 'relative;',
          left: '10%',
          right: '14%',
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}
        >
          {props
            .getHistoricalData()
            ['temperature_2m_max']?.map((item, index) => (
              <Grid item xs={3}>
                <Card sx={{ height: '110%', width: '100%' }}>
                  <Typography variant="body1" gutterBottom>
                    {props.days[index]} {props.dateStamp[index]}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Temperature:{' '}
                    {item +
                      props.data.daily_units.temperature_2m_max +
                      ' / ' +
                      props.getHistoricalData()['temperature_2m_min'][index] +
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

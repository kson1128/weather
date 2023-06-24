import React from 'react';
import { Line } from 'react-chartjs-2';

export default function HistoricalChart({ props }) {
  const data = {
    labels: props.dateStamp,
    datasets: [
      {
        label: 'Temperature',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(105,105,105)',
        borderColor: 'rgba(105,105,105)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(4,217,255)',
        pointBackgroundColor: '#000000',
        pointBorderWidth: 2,
        pointHoverRadius: 5.5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: props.getHistoricalData()['temperature_2m_max'],
      },
    ],
  };

  console.log('props', props.getHistoricalData());
  const Chart = () => (
    <div>
      <h2>Past 5 Days</h2>
      <Line data={data} width={400} height={400} />
    </div>
  );
  return <>{Chart()}</>;
}

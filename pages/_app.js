import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material';
import Box from '@mui/material/Box';
import '../styles/Home.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const theme = createTheme();

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: 'url("https://i.imgur.com/GRRCw9G.jpg")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minHeight: '100vh',
        }}
      >
        <Component {...pageProps} />
        <ToastContainer />
      </Box>
    </>
  );
}

export default MyApp;

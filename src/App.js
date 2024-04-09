import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LoadingPage from './components/LoadingPage';
import { LoadingProvider } from './components/LoadingContext';
import FullScreenLoadingScreen from './components/FullScreenLoadingScreen';
// ----------------------------------------------------------------------

export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const firstVisit = localStorage.getItem('firstVisit');
    if (!firstVisit) {
      setLoading(true);
      localStorage.setItem('firstVisit', 'false');
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }

    const handleBeforeUnload = () => {
      localStorage.setItem('firstVisit', 'true');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (loading) {
    return <LoadingPage />;
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReactNotifications />

      <LoadingProvider>
        <FullScreenLoadingScreen />
        <HelmetProvider>
          <BrowserRouter>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <Router />
            </ThemeProvider>
          </BrowserRouter>
        </HelmetProvider>
      </LoadingProvider>
    </LocalizationProvider>
  );
}

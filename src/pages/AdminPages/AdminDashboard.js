import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';
import { handleCustomAlert } from '../../components/handleCustomAlert';
// sections
import Upload from '../../components/Upload';
import { AppCurrentVisits } from '../../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [basicChartData, setBasicChartData] = useState([{ label: 'No Data', value: 0 }]);
  const [addOnChartData, setAddOnChartData] = useState([{ label: 'No Data', value: 0 }]);
  const [basicTo, setBasicTo] = useState(dayjs());
  const [addOnTo, setAddOnTo] = useState(dayjs());
  const [basicFrom, setBasicFrom] = useState(dayjs().subtract(1, 'month').add(1, 'day'));
  const [addOnFrom, setAddOnFrom] = useState(dayjs().subtract(1, 'month').add(1, 'day'));

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/verify/details',
          { xhrfields: { withCredentials: true } },
          {
            withCredentials: true,
          }
        );

        // If the response is successful, you can access the protected user data here
        const user = response.data.userInfo;
        if (user.person !== 'Admin') navigate('/login', { replace: true });
        localStorage.setItem('email', user.email);
        localStorage.setItem('name', user.name);
      } catch (error) {
        // Handle errors, such as token validation failure or network issues
        localStorage.clear();
        sessionStorage.clear();
        if (error.response && error.response.data && error.response.data.msg) {
          const errorMessage = error.response.data.msg;
          // Display the error message to the user (e.g., using an alert or on the UI)
          handleCustomAlert('Error', errorMessage, 'danger');
        } else {
          // Handle unexpected errors
          console.error(error);
          // If token validation fails or there's an error, navigate the user to the login page
        }
        navigate('/login', { replace: true });
      }
    }

    fetchData();
  }, [navigate]);

  const handleBasicUpdate = async () => {
    const diffInDates = basicTo.diff(basicFrom, 'd');

    if (diffInDates > 31) {
      handleCustomAlert(
        'Error',
        'The difference between the from and to dates should not be more than a month.',
        'danger'
      );
    } else if (diffInDates <= 31) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/admin/basic/trnx`,
          {
            from: basicFrom,
            to: basicTo,
          },
          { withCredentials: true }
        );
        const basicCalc = response.data;
        const chartData =
          basicCalc.length > 0
            ? basicCalc.map((item) => {
                let labelName = item._id;
                if (labelName === 'mess-kumar') {
                  labelName = 'Kumar Mess';
                } else if (labelName === 'mess-ssai') {
                  labelName = 'Sai Mess';
                } else if (labelName === 'mess-galav') {
                  labelName = 'Galav Mess';
                }
                return {
                  label: labelName,
                  value: item.count,
                };
              })
            : [{ label: 'No Data', value: 0 }];
        setBasicChartData(chartData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAddOnUpdate = async () => {
    const diffInDate = addOnTo.diff(addOnFrom, 'd');
    if (diffInDate > 31) {
      handleCustomAlert(
        'Error',
        'The difference between the from and to dates should not be more than a month.',
        'danger'
      );
    } else if (diffInDate <= 31) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/admin/addon/trnx`,
          {
            from: addOnFrom,
            to: addOnTo,
          },
          { withCredentials: true }
        );
        const addOnCalc = response.data;
        const chartData =
          addOnCalc.length > 0
            ? addOnCalc.map((item) => {
                let labelName = item._id;
                if (labelName === 'mess-kumar') {
                  labelName = 'Kumar Mess';
                } else if (labelName === 'mess-ssai') {
                  labelName = 'Sai Mess';
                } else if (labelName === 'mess-galav') {
                  labelName = 'Galav Mess';
                }
                return {
                  label: labelName,
                  value: item.amount,
                };
              })
            : [{ label: 'No Data', value: 0 }];
        setAddOnChartData(chartData);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    handleAddOnUpdate();
    handleBasicUpdate();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Helmet>
        <title> Admin Dashboard | IIT Bhilai Dining Page </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h2" sx={{ mb: 0 }}>
          Welcome Admin!
        </Typography>
        <Typography variant="h6" sx={{ ml: 1, mb: 5 }}>
          Quickly go through your work!
        </Typography>
        <div>
          {' '}
          <Typography variant="h4" sx={{ mb: 3 }}>
            Upload your New Transaction CSV File 📄
          </Typography>
          <Upload />
        </div>

        <Typography variant="h4" sx={{ mb: 3 }}>
          Have an eye on Messes🧐!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              children={
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '24px' }}>
                  <DatePicker
                    label={'From'}
                    openTo="day"
                    value={basicFrom}
                    onChange={(basicFrom) => setBasicFrom(basicFrom)}
                    views={['day', 'month', 'year']}
                    sx={{ maxWidth: '155px' }}
                  />
                  <DatePicker
                    label={'To'}
                    openTo="day"
                    value={basicTo}
                    onChange={(basicTo) => setBasicTo(basicTo)}
                    views={['day', 'month', 'year']}
                    sx={{ maxWidth: '155px' }}
                  />
                  <Button
                    onClick={handleBasicUpdate}
                    variant="contained"
                    sx={{ margin: 'auto 1rem', maxHeight: '40px' }}
                  >
                    Update
                  </Button>
                </div>
              }
              title="Basic Comparison Chart"
              chartData={basicChartData}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.action.main,
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              children={
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '24px' }}>
                  <DatePicker
                    label={'From'}
                    openTo="day"
                    value={addOnFrom}
                    onChange={(addOnFrom) => setAddOnFrom(addOnFrom)}
                    views={['day', 'month', 'year']}
                    sx={{ maxWidth: '155px' }}
                  />
                  <DatePicker
                    label={'To'}
                    openTo="day"
                    value={addOnTo}
                    onChange={(addOnTo) => setAddOnTo(addOnTo)}
                    views={['day', 'month', 'year']}
                    sx={{ maxWidth: '155px' }}
                  />
                  <Button
                    onClick={handleAddOnUpdate}
                    variant="contained"
                    sx={{ margin: 'auto 1rem', maxHeight: '40px' }}
                  >
                    Update
                  </Button>
                </div>
              }
              title="Add-On Comparison Chart"
              chartData={addOnChartData}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.action.main,
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

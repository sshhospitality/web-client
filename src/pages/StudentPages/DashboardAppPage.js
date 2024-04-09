import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// sections
import trnxList from '../../utils/trnxHistory';
import {
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
} from '../../sections/@dashboard/app';

function getCurrentDay() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  return daysOfWeek[currentDayIndex];
}
export default function DashboardAppPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [txn, setTxn] = useState([]); // State to store user info
  const [name, setName] = useState('');
  const [messName, setMessName] = useState('');
  // eslint-disable-next-line
  const [remainingAmount, setRemain] = useState('');
  const [totalAmount, setTotal] = useState('');
  // eslint-disable-next-line
  const [day, setday] = useState(getCurrentDay());
  const [menu, setMenu] = useState([]);
  const [todaymenu, updtmenu] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/verify/details',
          { xhrFields: { withCredentials: true } },
          { withCredentials: true }
        );
        const user = response.data.userInfo;

        localStorage.setItem('email', user.email);
        localStorage.setItem('mess', user.mess);
        localStorage.setItem('name', user.name);
        localStorage.setItem('id', user.id);
        setName(user.name);
        setMessName(user.mess);
        setRemain(user.remaining_amount);
        setTotal(user.total_amount);
        const trxnHis = await trnxList(user.id);
        setTxn(trxnHis);

        const menu = await axios.post(
          'http://localhost:5000/api/menu/list',
          {
            xhrFields: {
              withCredentials: true,
            },
          },
          { withCredentials: true }
        );
        setMenu(menu.data);
      } catch (error) {
        // Handle errors, such as token validation failure or network issues
        localStorage.clear();
        if (error.response && error.response.data && error.response.data.msg) {
          const errorMessage = error.response.data.msg;
          // Display the error message to the user (e.g., using an alert or on the UI)
          alert(errorMessage);
        } else {
          // Handle unexpected errors
          console.error(error);
          // If token validation fails or there's an error, navigate the user to the login page
        }
        navigate('/login', { replace: true });
      }
    }

    fetchData();
  }, [navigate]); // Empty dependency array, runs once on mount
  useEffect(() => {
    menu.forEach((d) => {
      if (d.name === day) {
        updtmenu(d.meals);
      }
    });
  }, [menu, day]);
  let meal = '';
  const currentHour = new Date().getHours();
  if (currentHour >= 10 && currentHour < 15) meal = 'Lunch';
  else if (currentHour >= 15 && currentHour < 18) meal = 'Snacks';
  else if (currentHour >= 18 && currentHour < 22) meal = 'Dinner';
  else meal = 'Breakfast';
  const transformedData = todaymenu.map((menu, index) => ({
    id: menu._id, // Assuming _id is available in your database data
    title: menu.type, // Set title to the 'type' field in your schema
    description: menu.items.map((item) => item.name).join(', '), // Join all item names as the description
    image: `/assets/images/covers/cover_${index + 1}.avif`,
  }));

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const isoSevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0]; // Get only the date part
  const filteredData = txn.filter((item) => {
    const trnsDate = new Date(item.transaction_date).toISOString().split('T')[0]; // Get only the date part
    return trnsDate >= isoSevenDaysAgo && trnsDate <= new Date().toISOString().split('T')[0]; // Get only the date part
  });
  const sumsByDate = {};

  filteredData.forEach((item) => {
    const trnsDate = new Date(item.transaction_date).toISOString().split('T')[0]; // Get only the date part

    if (Object.prototype.hasOwnProperty.call(sumsByDate, trnsDate)) {
      sumsByDate[trnsDate] += parseFloat(item.amount); // Add the amount to the existing sum for the date
    } else {
      sumsByDate[trnsDate] = parseFloat(item.amount); // Initialize the sum for the date
    }
  });
  const basicConsumed = txn.reduce((count, item) => (item.amount === 0 ? count + 1 : count), 0) * 48;
  function countDays() {
    // Define the start date (August 2nd)
    const startDate = new Date('2023-12-28');
    // Get the current date
    const currentDate = new Date();
    // Calculate the time difference in milliseconds
    const timeDifference = currentDate - startDate;
    // Calculate the number of days by dividing milliseconds by (1000ms * 60s * 60min * 24h)
    const numberOfDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return numberOfDays;
  }
  const basicTotal = countDays() * 96;
  // Convert the sumsByDate object into an array of objects with date and sum
  const sumsArray = Object.keys(sumsByDate).map((date) => sumsByDate[date]);
  const amtSum = txn
    .filter((item) => item.remarks !== 'Recharge')
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);

  useEffect(() => {
    // Function to format the date in the required format
    const formatDate = (date) => {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      return new Date(date).toLocaleDateString('en-US', options);
    };

    // Function to update the timeline state
    const updateTimeline = () => {
      const updatedTimeline = txn.map((transaction) => ({
        category: transaction.category,
        time: formatDate(transaction.transaction_date),
      }));
      setTimeline(updatedTimeline);
    };

    // Call the updateTimeline function
    updateTimeline();
  }, [txn]);

  const amount = `${amtSum}/${totalAmount - 11520}`;
  return (
    <>
      <Helmet>
        <title> Dashboard | IIT Bhilai Dining Page </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h2" sx={{ mb: 5 }}>
          Welcome! {name}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Registered Mess" total={messName} icon={'ant-design:home-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Up Coming Meal"
              total={meal}
              color="info"
              icon={'ant-design:interaction-twotone'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Add On Status"
              total={amount}
              color="warning"
              icon={'ant-design:money-collect-twotone'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Basic Status"
              total={`${basicConsumed}/11520`}
              color="error"
              icon={'ant-design:bank-twotone'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Daily Consumption"
              subheader="Last 7 Days"
              chartData={[
                {
                  name: 'Basic Consumed',
                  type: 'bar',
                  fill: 'solid',
                  data: [48, 96, 0, 48, 0, 96, 48],
                },
                {
                  name: 'Add-On Consumed',
                  type: 'bar', // Change type to 'bar' for histogram
                  fill: 'solid',
                  data: sumsArray, // Replace with your histogram data
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Dinning Chart"
              chartData={[
                { label: 'Basic Consumed', value: basicConsumed },
                { label: 'Basic Wasted', value: basicTotal - basicConsumed },
                { label: 'Basic Left', value: 11520 - basicTotal },
                { label: 'Add-On Consumed', value: amtSum },
                { label: 'Add-On Left', value: totalAmount - amtSum - 11520 },
              ]}
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

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate title="Today's Menu" list={transformedData} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Meal Timeline"
              list={timeline
                .filter((item) => {
                  // Check if the transaction date belongs to the current date
                  const currentDate = new Date();
                  const transactionDate = new Date(item.time);
                  return (
                    currentDate.getDate() === transactionDate.getDate() &&
                    currentDate.getMonth() === transactionDate.getMonth() &&
                    currentDate.getFullYear() === transactionDate.getFullYear()
                  );
                })
                .map((item, index) => ({
                  id: item.id,
                  title: item.category, // Set title to the 'category' from timeline
                  type: `order${index + 1}`,
                  time: item.time,
                }))}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

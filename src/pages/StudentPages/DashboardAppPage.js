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
  const [idNumber, setId] = useState('');
  // eslint-disable-next-line
  const [totalAmount, setTotal] = useState('');
  // eslint-disable-next-line
  const [day, setday] = useState(getCurrentDay());
  const [menu, setMenu] = useState([]);
  const [todaymenu, updtmenu] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [transactionsToday,setTransactionsToday] = useState(0);
  const [breakfastCounts,setBreakfastCounts] = useState([]);
  const [lunchCounts,setLunchCounts] = useState([]);
  const [grace1LunchCounts,setGrace1LunchCounts] = useState([]);
  const [grace2LunchCounts,setGrace2LunchCounts] = useState([]);
  const [snacksCounts,setSnacksCounts] = useState([]);
  const [dinnerCounts,setDinnerCounts] = useState([]);
  const [grace1DinnerCounts, setgrace1DinnerCounts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/verify/details',
          { xhrFields: { withCredentials: true } },
          { withCredentials: true }
        );
        const user = response.data.userInfo;
        setTransactionsToday(response.data.transactionsToday);
        console.log(response.data.transactionsToday);
        console.log(user);
        localStorage.setItem('email', user.email);
        localStorage.setItem('name', user.name);
        localStorage.setItem('id', user.userId);
        setName(user.name);
        setId(user.userId);
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
    async function fetchChartData() {
      try{
        const response = await axios.post(
          'http://localhost:5000/api/verify/chartdetails',
          { xhrFields: { withCredentials: true } },
          { withCredentials: true }
        );
        const chartDetails = response.data.mealTypeCountsByMonth;
        // chartDetails = chartDetails.reverse();
        // Extract data for each meal type from the last 6 elements of chartDetails array
        // const chartDetails = chartDetails.slice(-6);
        // console.log(chartDetails);
        setBreakfastCounts(chartDetails.map(item => item.mealTypeCounts.find(count => count.mealType === 'Breakfast')?.count || 0));
        setLunchCounts(chartDetails.map(item => item.mealTypeCounts.find(count => count.mealType === 'Lunch')?.count || 0));
        console.log(lunchCounts);

        setGrace1LunchCounts(chartDetails.map(item => item.mealTypeCounts.find(count => count.mealType === 'Grace1_Lunch')?.count || 0));
        setGrace2LunchCounts(chartDetails.map(item => item.mealTypeCounts.find(count => count.mealType === 'Grace2_Lunch')?.count || 0));
        setSnacksCounts(chartDetails.map(item => item.mealTypeCounts.find(count => count.mealType === 'snacks')?.count || 0));
        setDinnerCounts(chartDetails.map(item => item.mealTypeCounts.find(count => count.mealType === 'dinner')?.count || 0));
        setgrace1DinnerCounts(chartDetails.map(item => item.mealTypeCounts.find(count => count.mealType === 'grace1_dinner')?.count || 0));
      } catch(error) {
        console.log(error);
      }
    }
    
    
    fetchData();
    fetchChartData();
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
  const currenMinute = new Date().getMinutes();
  if (currentHour >= 10 && currentHour < 14) meal = 'Lunch';
  else if (currentHour===14 && currenMinute<=29) meal = 'Grace1_Lunch';
  else if (currentHour===14 && currenMinute<=59) meal = 'Grace2_Lunch';
  else if (currentHour >= 15 && currentHour < 18) meal = 'Snacks';
  else if (currentHour>=18 && currentHour<22) meal = 'Dinner';
  else if (currentHour===22 && currenMinute<=29) meal = 'Grace1_Dinner';
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
            <AppWidgetSummary title="College" total="AIIMS Raipur" icon={'ant-design:home-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="ID Number"
              total={idNumber}
              color="warning"
              icon={'ant-design:money-collect-twotone'}
            />
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
              title="Number of Times Eaten Today"
              total={`${transactionsToday}/4`}
              color="error"
              icon={'ant-design:bank-twotone'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Monthly Consumption"
              subheader="Last 6 Months"
              chartData={[
                {
                  name: 'Breakfast',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: breakfastCounts, // Replace with the array of lunch counts for each month
                },
                {
                  name: 'Lunch',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: lunchCounts, // Replace with the array of lunch counts for each month
                },
                {
                  name: 'Grace1 Lunch',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: grace1LunchCounts, // Replace with the array of grace1 lunch counts for each month
                },
                {
                  name: 'Grace2 Lunch',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: grace2LunchCounts, // Replace with the array of grace2 lunch counts for each month
                },
                {
                  name: 'Snacks',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: snacksCounts, // Replace with the array of lunch counts for each month
                },
                {
                  name: 'Dinner',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: dinnerCounts, // Replace with the array of dinner counts for each month
                },
                {
                  name: 'Grace1 Dinner',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: grace1DinnerCounts, // Replace with the array of grace1 dinner counts for each month
                }
              ]}
            />
          </Grid>


          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Dinning Chart"
              chartData={[
                // { label: 'Basic Consumed', value: basicConsumed },
                // { label: 'Basic Wasted', value: basicTotal - basicConsumed },
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

import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';

import {
  AppWidgetSummary,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppCurrentDay,
  AppNewsUpdate,
} from '../../sections/@dashboard/app';
// ----------------------------------------------------------------------
function getCurrentDay() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  return daysOfWeek[currentDayIndex];
}
export default function VDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [userId, setUser] = useState(null); // State to store user info
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [breakfastCounts, setBreakfastCounts] = useState([]);
  const [lunchCounts, setLunchCounts] = useState([]);
  const [grace1LunchCounts, setGrace1LunchCounts] = useState([]);
  const [grace2LunchCounts, setGrace2LunchCounts] = useState([]);
  const [snacksCounts, setSnacksCounts] = useState([]);
  const [dinnerCounts, setDinnerCounts] = useState([]);
  const [grace1DinnerCounts, setgrace1DinnerCounts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dayWiseData, setDayWiseData] = useState([]);
  const [todaymenu, updtmenu] = useState([]);
  const [day, setday] = useState(getCurrentDay());
  const [menu, setMenu] = useState([]);
  async function fetchData() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/verify/details`,
        {
          xhrFields: { withCredentials: true },
        },
        { withCredentials: true }
      );
      // If the response is successful, you can access the protected user data here
      const user = response.data.userInfo;
      localStorage.setItem('name', user.name);
      localStorage.setItem('phone', user.phone);
      localStorage.setItem('cid', user.cid);
      localStorage.setItem('address', user.address);

      // localStorage.setItem('mess', user.mess);
      setName(user.name);
      setCollege(user.cid);
    } catch (error) {
      // Handle errors, such as token validation failure or network issues
      localStorage.clear();
      sessionStorage.clear();
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
  async function fetchDayWiseData() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/verify/mealtimeline`,
        { xhrFields: { withCredentials: true } },
        { withCredentials: true }
      );
      const DayWiseDetails = response.data.mealTypeCountsForToday;
      const formattedDayWiseData = DayWiseDetails.map((item) => ({
        label: item.mealType,
        value: item.count,
      }));
      setDayWiseData(formattedDayWiseData);
      console.log(DayWiseDetails);
      // const formattedChartData = chartDetails[0].mealTypeCounts.map((item) => ({
      //   label: item.mealType,
      //   value: item.count,
      // }));
      // setChartData(formattedChartData);

      // // Initialize an object to store counts for each meal type
      // const mealTypeCounts = {
      //   Breakfast: [],
      //   Lunch: [],
      //   Grace1_Lunch: [],
      //   Grace2_Lunch: [],
      //   Snacks: [],
      //   Dinner: [],
      //   Grace1_Dinner: [],
      // };

      // // Populate counts for each meal type
      // for (let i = 0; i < 6; i+=1) {
      //   if(chartDetails[i]){
      //   const monthData = chartDetails[i];

      //   Object.keys(mealTypeCounts).forEach((mealType) => {
      //     const countObj = monthData.mealTypeCounts.find((count) => count.mealType === mealType);
      //     mealTypeCounts[mealType].push(countObj ? countObj.count : 0);
      //   });
      // }
      // else{
      //   Object.keys(mealTypeCounts).forEach((mealType) => {
      //     // const countObj = monthData.mealTypeCounts.find((count) => count.mealType === mealType);
      //     mealTypeCounts[mealType].push(0);
      //   });
      // }
      // }

      // // Set state variables for each meal type
      // setBreakfastCounts(mealTypeCounts.Breakfast);
      // setLunchCounts(mealTypeCounts.Lunch);
      // setGrace1LunchCounts(mealTypeCounts.Grace1_Lunch);
      // setGrace2LunchCounts(mealTypeCounts.Grace2_Lunch);
      // setSnacksCounts(mealTypeCounts.Snacks);
      // setDinnerCounts(mealTypeCounts.Dinner);
      // setgrace1DinnerCounts(mealTypeCounts.Grace1_Dinner);
      // console.log(mealTypeCounts.Lunch);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChartData() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/verify/chartdetails`,
        { xhrFields: { withCredentials: true } },
        { withCredentials: true }
      );
      const chartDetails = response.data.mealTypeCountsByMonth;
      const formattedChartData = chartDetails[0].mealTypeCounts.map((item) => ({
        label: item.mealType,
        value: item.count,
      }));
      setChartData(formattedChartData);

      // Initialize an object to store counts for each meal type
      const mealTypeCounts = {
        Breakfast: [],
        Lunch: [],
        Grace1_Lunch: [],
        Grace2_Lunch: [],
        Snacks: [],
        Dinner: [],
        Grace1_Dinner: [],
      };

      // Populate counts for each meal type
      for (let i = 0; i < 6; i += 1) {
        if (chartDetails[i]) {
          const monthData = chartDetails[i];

          Object.keys(mealTypeCounts).forEach((mealType) => {
            const countObj = monthData.mealTypeCounts.find((count) => count.mealType === mealType);
            mealTypeCounts[mealType].push(countObj ? countObj.count : 0);
          });
        } else {
          Object.keys(mealTypeCounts).forEach((mealType) => {
            // const countObj = monthData.mealTypeCounts.find((count) => count.mealType === mealType);
            mealTypeCounts[mealType].push(0);
          });
        }
      }

      // Set state variables for each meal type
      setBreakfastCounts(mealTypeCounts.Breakfast);
      setLunchCounts(mealTypeCounts.Lunch);
      setGrace1LunchCounts(mealTypeCounts.Grace1_Lunch);
      setGrace2LunchCounts(mealTypeCounts.Grace2_Lunch);
      setSnacksCounts(mealTypeCounts.Snacks);
      setDinnerCounts(mealTypeCounts.Dinner);
      setgrace1DinnerCounts(mealTypeCounts.Grace1_Dinner);
    } catch (error) {
      console.log(error);
    }
  }
  async function getMenu(){
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/menu/list`,
        {
          xhrFeilds: {
            withCredentials: true,
          },
        },
        { withCredentials: true }
      );
      setMenu(data[0]["days"]);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchDayWiseData();
    fetchChartData();
    fetchData();
    getMenu();
  }, [navigate]); // Empty dependency array, runs once on mount
  useEffect(() => {
    menu.forEach((d) => {
      if (d.name === day) {
        updtmenu(d.meals);
      }
    });
  }, [menu, day]);
  const transformedData = todaymenu.map((menu, index) => ({
    id: menu._id, // Assuming _id is available in your database data
    title: menu.type, // Set title to the 'type' field in your schema
    description: menu.items.map((item) => item.name).join(', '), // Join all item names as the description
    image: `/assets/images/covers/cover_${index + 1}.avif`,
  }));
  let meal = '';
  const currentHour = new Date().getHours();
  const currenMinute = new Date().getMinutes();
  if (currentHour >= 10 && currentHour < 14) meal = 'Lunch';
  else if (currentHour === 14 && currenMinute <= 29) meal = 'Grace1_Lunch';
  else if (currentHour === 14 && currenMinute <= 59) meal = 'Grace2_Lunch';
  else if (currentHour >= 15 && currentHour < 18) meal = 'Snacks';
  else if (currentHour >= 18 && currentHour < 22) meal = 'Dinner';
  else if (currentHour === 22 && currenMinute <= 29) meal = 'Grace1_Dinner';
  else meal = 'Breakfast';
  return (
    <>
      <Helmet>
        <title> Vendor Dashboard | Digimess Dinning System </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h2" sx={{ mb: 5 }}>
          Welcome! {name}
        </Typography>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Today's Menu
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="College ID" total={college} icon={'ant-design:home-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Up Coming Meal"
              total={meal}
              color="info"
              icon={'ant-design:interaction-twotone'}
            />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Maggie"
              total={'Snacks'}
              color="warning"
              sx={{ display: 'none' }}
              icon={'ant-design:money-collect-twotone'}
            />
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Biryani"
              total={'Dinner'}
              color="error"
              sx={{ display: 'none' }}
              icon={'ant-design:bank-twotone'}
            />
          </Grid> */}
          <Grid item xs={12} md={12} lg={12} sx={{ marginBottom: 5 }}>
            <AppWebsiteVisits
              title="Monthly Consumption"
              subheader="Last 6 Months"
              chartData={[
                {
                  name: 'Breakfast',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: breakfastCounts.reverse(), // Replace with the array of lunch counts for each month
                },
                {
                  name: 'Lunch',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: lunchCounts.reverse(), // Replace with the array of lunch counts for each month
                },
                {
                  name: 'Grace1 Lunch',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: grace1LunchCounts.reverse(), // Replace with the array of grace1 lunch counts for each month
                },
                {
                  name: 'Grace2 Lunch',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: grace2LunchCounts.reverse(), // Replace with the array of grace2 lunch counts for each month
                },
                {
                  name: 'Snacks',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: snacksCounts.reverse(), // Replace with the array of lunch counts for each month
                },
                {
                  name: 'Dinner',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: dinnerCounts.reverse(), // Replace with the array of dinner counts for each month
                },
                {
                  name: 'Grace1 Dinner',
                  type: 'bar',
                  stackId: 'monthly',
                  fill: 'solid',
                  data: grace1DinnerCounts.reverse(), // Replace with the array of grace1 dinner counts for each month
                },
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              style={{ width: '150%' }}
              title="Breakfast Stats"
              subheader="Previous 7 Days"
              chartLabels={[
                '01/01/2003',
                '01/02/2003',
                '01/03/2003',
                '01/04/2003',
                '01/05/2003',
                '01/06/2003',
                '01/07/2003',
              ]}
              chartData={[
                {
                  name: 'Basic',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              style={{ width: '150%' }}
              title="Lunch Stats"
              subheader="Previous 7 Days"
              chartLabels={[
                '01/01/2003',
                '01/02/2003',
                '01/03/2003',
                '01/04/2003',
                '01/05/2003',
                '01/06/2003',
                '01/07/2003',
              ]}
              chartData={[
                {
                  name: 'Basic',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21],
                },
                {
                  name: 'Add-On',
                  type: 'line',
                  fill: 'solid',
                  data: [44, 41, 55, 43, 21, 20, 67],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              style={{ width: '150%' }}
              title="Snacks Stats"
              subheader="Previous 7 Days"
              chartLabels={[
                '01/01/2003',
                '01/02/2003',
                '01/03/2003',
                '01/04/2003',
                '01/05/2003',
                '01/06/2003',
                '01/07/2003',
              ]}
              chartData={[
                {
                  name: 'Basic',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              style={{ width: '150%' }}
              title=" Dinner Stats"
              subheader="Previous 7 Days"
              chartLabels={[
                '01/01/2003',
                '01/02/2003',
                '01/03/2003',
                '01/04/2003',
                '01/05/2003',
                '01/06/2003',
                '01/07/2003',
              ]}
              chartData={[
                {
                  name: 'Basic',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21],
                },
                {
                  name: 'Add-On',
                  type: 'line',
                  fill: 'solid',
                  data: [44, 41, 55, 43, 21, 22, 67],
                },
              ]}
            />
          </Grid> */}
          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Today's Dinning Chart"
              chartData={[
                // { label: 'Basic Consumed', value: 4344 },
                { label: 'Had Food', value: 5435 },
                { label: 'Left to have Food', value: 1443 },
                // { label: 'Add-On Consumed', value: 4443 },
                // { label: 'Add-On Left', value: 4443 },
              ]}
              chartColors={[
                theme.palette.info.main,
                theme.palette.warning.main
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Dinning Chart For Current Month"
              chartData={chartData}
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

          {/* Second AppCurrentVisits */}
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDay
              // Empty string as the title to avoid duplication
              title="Dinning Chart For Current Day"
              dayWiseData={dayWiseData} // Assuming chartData is the same for both
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
        </Grid>
      </Container>
    </>
  );
}

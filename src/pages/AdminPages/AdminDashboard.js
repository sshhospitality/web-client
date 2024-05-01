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
import { AppNewsUpdate, AppCurrentVisits, AppWebsiteVisits ,AppCurrentDay} from '../../sections/@dashboard/app';

// ----------------------------------------------------------------------
function getCurrentDay() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  return daysOfWeek[currentDayIndex];
}
export default function DashboardAppPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [day, setday] = useState(getCurrentDay());
  const [basicChartData, setBasicChartData] = useState([{ label: 'No Data', value: 0 }]);
  const [addOnChartData, setAddOnChartData] = useState([{ label: 'No Data', value: 0 }]);
  const [basicTo, setBasicTo] = useState(dayjs());
  const [addOnTo, setAddOnTo] = useState(dayjs());
  const [basicFrom, setBasicFrom] = useState(dayjs().subtract(1, 'month').add(1, 'day'));
  const [addOnFrom, setAddOnFrom] = useState(dayjs().subtract(1, 'month').add(1, 'day'));
  const [breakfastCounts,setBreakfastCounts] = useState([]);
  const [lunchCounts,setLunchCounts] = useState([]);
  const [grace1LunchCounts,setGrace1LunchCounts] = useState([]);
  const [grace2LunchCounts,setGrace2LunchCounts] = useState([]);
  const [snacksCounts,setSnacksCounts] = useState([]);
  const [dinnerCounts,setDinnerCounts] = useState([]);
  const [grace1DinnerCounts, setgrace1DinnerCounts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dayWiseData, setDayWiseData] = useState([]);
  const [todaymenu, updtmenu] = useState([]);
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API}/api/verify/details`,
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
    async function fetchChartData() {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API}/api/verify/chartdetails`,
          { xhrFields: { withCredentials: true } },
          { withCredentials: true }
        );
        const chartDetails = response.data.mealTypeCountsByMonth;
        console.log(chartDetails[0].mealTypeCounts);
    
        const formattedChartData = chartDetails[0].mealTypeCounts.map((item) => ({
          label: item.mealType,
          value: item.count,
        }));
        console.log(formattedChartData);
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
        for (let i = 0; i < 6; i+=1) {
          if(chartDetails[i]){
          const monthData = chartDetails[i];
          
          Object.keys(mealTypeCounts).forEach((mealType) => {
            const countObj = monthData.mealTypeCounts.find((count) => count.mealType === mealType);
            mealTypeCounts[mealType].push(countObj ? countObj.count : 0);
          });
        }
        else{
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
        console.log(mealTypeCounts.Lunch);
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchDayWiseData() {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API}/api/verify/mealtimeline`,
          { xhrFields: { withCredentials: true } },
          { withCredentials: true }
        );
        const DayWiseDetails = response.data.mealTypeCountsForToday;
        console.log(DayWiseDetails);
        const formattedDayWiseData = DayWiseDetails.map((item) => ({
          label: item.mealType,
          value: item.count,
        }));
        setDayWiseData(formattedDayWiseData);
        console.log(formattedDayWiseData);
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
    async function getMenu(){
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/menu/list`,
          {
            xhrFeilds: {
              withCredentials: true,
            },
          },
          { withCredentials: true }
        );
        setMenu(data);
        console.log(data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchChartData();
    fetchData();
    fetchDayWiseData();
    getMenu();
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
          `${process.env.REACT_APP_API}/api/admin/basic/trnx`,
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
        <Grid item xs={12} md={6} lg={8} sx ={{ marginBottom: 5 }}>
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
                }
              ]}
            />
          </Grid>

          <Grid container spacing={2}>
  {/* First AppCurrentVisits */}
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
          <Grid item xs={12} md={6} lg={4}>
            <AppNewsUpdate title="Today's Menu" list={transformedData} />
          </Grid>
        </Grid>

      </Container>
    </>
  );
}

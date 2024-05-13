import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Swal from 'sweetalert2';

export default function DDashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [openDialog, setOpenDialog] = useState(false); // State for dialog box
  const [value, setValue] = React.useState(dayjs());
  const [foodItems, setFoodItems] = useState([{ name: '', quantity: '' }]); // State to store food items

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API}/verify/details`,
          { xhrFields: { withCredentials: true } },
          { withCredentials: true }
        );
        const user = response.data.userInfo;
        localStorage.setItem('name', user.name);
        localStorage.setItem('departmentId', user.did);
        localStorage.setItem('phone', user.phone);
        localStorage.setItem('address', user.address);
        setName(user.name);
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

  const handleAddItem = () => {
    setFoodItems([...foodItems, { name: '', quantity: '' }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...foodItems];
    updatedItems.splice(index, 1);
    setFoodItems(updatedItems);
  };

  const handleItemNameChange = (index, value) => {
    const updatedItems = [...foodItems];
    updatedItems[index].name = value;
    setFoodItems(updatedItems);
  };

  const handleItemQuantityChange = (index, value) => {
    const updatedItems = [...foodItems];
    updatedItems[index].quantity = value;
    setFoodItems(updatedItems);
  };

  const handleSubmit = async () => {
    // Handle form submission
    try{
      await axios.post(
        `${process.env.REACT_APP_API}/department/department_txn`,
        { date_and_time: value, meal_items: foodItems },
        { withCredentials: true }
      );
      console.log('Submitted food items:', foodItems);
      Swal.fire({
        icon: 'success',
        title: 'Ordered Placed Successfully',
      });
      handleDialogClose();
    }
    catch(error){
      Swal.fire({
        icon: 'error',
        title: 'Ooops, something went wrong',
        text: error.text,
      });
      console.error('Error submitting food items:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | Digimess Dining Page </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h2" sx={{ mb: 5 }}>
          Welcome! {name}
        </Typography>

        <Button variant="contained" onClick={handleDialogOpen}>
          Book Order
        </Button>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Book Order</DialogTitle>
          <DialogContent>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} fullWidth />}
              label="Select Date and Time"
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
            {/* Dynamic food items form */}
            <Box mt={2}>
              {foodItems.map((item, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <TextField
                    label="Item Name"
                    value={item.name}
                    style={{ marginRight: '16px' }}
                    onChange={(e) => handleItemNameChange(index, e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Quantity"
                    value={item.quantity}
                    style={{ marginRight: '16px' }}
                    onChange={(e) => handleItemQuantityChange(index, e.target.value)}
                    fullWidth
                  />
                  {index > 0 && ( // Render remove button for all fields except the first one
                    <IconButton onClick={() => handleRemoveItem(index)}>
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddItem} style={{ marginBottom: '16px' }}>
                Add Item
              </Button>
            </Box>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </DialogContent>
        </Dialog>

        {/* Your existing content */}
      </Container>
    </>
  );
}

import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Container,
  Stack,
  Typography,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import PropTypes from 'prop-types';
import { ProductSort, ProductCard } from '../../sections/@dashboard/products';

// ----------------------------------------------------------------------
function getCurrentDay() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay(); // Returns a number (0 for Sunday, 1 for Monday, etc.)
  return daysOfWeek[currentDayIndex];
}
// ----------------------------------------------------------------------

export default function AdminMenuDetails() {
  const navigate = useNavigate();
  const [day, setDay] = useState(getCurrentDay());
  const [menu, setMenu] = useState([]);
  const [todayMenu, setTodayMenu] = useState([]);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([{ dayTime: '', category: '', name: '', price: '', type: '' }]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/menu/list`,
          { xhrFields: { withCredentials: true } },
          { withCredentials: true }
        );
        const { data } = response;
        setMenu(data);
        setTodayMenu([]);
      } catch (error) {
        if (error.response.status === 401) {
          navigate('/login', { replace: true });
        }
        console.error('Error fetching menu:', error);
      }
    }
    fetchMenu();
  }, [navigate]);

  useEffect(() => {
    menu.forEach((dayMenu) => {
      if (dayMenu.name === day) {
        setTodayMenu(dayMenu.meals);
      }
    });
  }, [day, menu]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/menu/updateMenu',
        { messName: 'Kumar', menu: items },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error updating menu:', error);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { dayTime: '', category: '', name: '', price: '', type: '' }]);
  };

  const handleItemChange = (index, field, event) => {
    const newItems = [...items];
    newItems[index][field] = event.target.value;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <>
      <Helmet>
        <title> Mess Details | IIT Bhilai Dining System </title>
      </Helmet>

      <Container>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '150%',
              mx: 'auto',
              p: 4,
              borderRadius: '12px',
              boxShadow: 6,
              height: 'auto',
            }}
          >
            <Typography variant="h2" style={{ marginBottom: '2rem' }}>
              Menu
            </Typography>

            <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" mb={5}>
              <ProductSort setDay={setDay} />
            </Stack>

            <Typography variant="h3" style={{ color: '#2b2c30', marginBottom: '1rem' }}>
              {day}
            </Typography>

            {todayMenu.map((item, itemIndex) => (
              <div key={itemIndex}>
                <Typography
                  variant="h4"
                  my={'20px'}
                  style={{ backgroundColor: '#d0f2ff', padding: '0px 10px', color: '#04297a' }}
                >
                  {item.type}
                </Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                  {item.items.map((i, index) => (
                    <ProductCard
                      key={index}
                      name={i.name}
                      price={i.price}
                      category={i.category}
                      type={i.type}
                      time={item.type}
                    />
                  ))}
                </div>
                <hr />
              </div>
            ))}

            <Button variant="contained" onClick={handleOpen} style={{ marginTop: '1rem' }}>
              Edit Menu
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="lg">
              <DialogTitle>Edit {day}'s Menu</DialogTitle>
              <DialogContent>
                {items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id={`item-${index}-dayTime`}
                      label="Day Time"
                      type="text"
                      fullWidth
                      value={item.dayTime}
                      onChange={(event) => handleItemChange(index, 'dayTime', event)}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id={`item-${index}-category`}
                      label="Category"
                      type="text"
                      fullWidth
                      value={item.category}
                      onChange={(event) => handleItemChange(index, 'category', event)}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id={`item-${index}-name`}
                      label="Name"
                      type="text"
                      fullWidth
                      value={item.name}
                      onChange={(event) => handleItemChange(index, 'name', event)}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id={`item-${index}-price`}
                      label="Price"
                      type="text"
                      fullWidth
                      value={item.price}
                      onChange={(event) => handleItemChange(index, 'price', event)}
                    />
                    <TextField
                      key={index}
                      autoFocus
                      margin="dense"
                      id={`item-${index}-type`}
                      label="Type"
                      type="text"
                      fullWidth
                      value={item.type}
                      onChange={(event) => handleItemChange(index, 'type', event)}
                    />
                    <Button onClick={() => handleRemoveItem(index)}>Remove</Button>
                  </div>
                ))}
                <Button variant="outlined" onClick={handleAddItem} style={{ marginTop: '1rem' }}>
                  Add Item
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleSubmit();
                    handleClose();
                  }}
                  style={{ marginLeft: '1rem', marginTop: '1rem' }}
                >
                  Save
                </Button>
              </DialogContent>
            </Dialog>
          </Box>
        </Box>
      </Container>
    </>
  );
}

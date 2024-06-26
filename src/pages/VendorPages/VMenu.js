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
  Select,
  MenuItem,
} from '@mui/material';
import PropTypes from 'prop-types';
import { ProductSort, ProductCard } from '../../sections/@dashboard/products';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// ----------------------------------------------------------------------
function getCurrentDay() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay(); // Returns a number (0 for Sunday, 1 for Monday, etc.)
  return daysOfWeek[currentDayIndex];
}
// ----------------------------------------------------------------------

export default function VMenu() {
  const navigate = useNavigate();
  const [day, setDay] = useState(getCurrentDay());
  const [menu, setMenu] = useState([]);
  const [todayMenu, setTodayMenu] = useState([]);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([{ dayTime: '', category: '', name: '' }]);

  async function fetchMenu() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/menu/list`,
        { xhrFields: { withCredentials: true } },
        { withCredentials: true }
      );
      const { data } = response;
      console.log(data[0]['days']);
      setMenu(data[0]['days']);
      setTodayMenu([]);
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login', { replace: true });
      }
      console.error('Error fetching menu:', error);
    }
  }
  useEffect(() => {
    fetchMenu();
  }, [navigate]);

  useEffect(() => {
    var key = false;
    menu.forEach((dayMenu) => {
      if (dayMenu.name === day) {
        setTodayMenu(dayMenu.meals);
        key = true;
      }
    });
    if (!key) setTodayMenu([]);
  }, [day, menu]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    console.log(items);
    const transformedArray = items.reduce((acc, currentItem) => {
      const { dayTime, category, name } = currentItem;
      const existingTypeIndex = acc.findIndex((item) => item.type === dayTime);

      if (existingTypeIndex !== -1) {
        acc[existingTypeIndex].items.push({ name, category });
      } else {
        acc.push({ type: dayTime, items: [{ name, category }] });
      }
      return acc;
    }, []);
    const transformedString = JSON.stringify(transformedArray)
      .replace(/\"([^\"]+)\":/g, '"$1":') // Quotes around keys
      .replace(/\"([^\"]+)\":/g, '"$1":'); // Quotes around values
    console.log(transformedString);
    console.log(day)
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/college/update-Menu`,
        { dayName: day, meals: JSON.parse(transformedString) },
        { withCredentials: true }
      );
      fetchMenu();
    } catch (error) {
      console.error('Error updating menu:', error);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { dayTime: '', category: '', name: '' }]);
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
  useEffect(() => {
    const newItems = [];
    menu.forEach((d) => {
      if (d.name === day) {
        d.meals.forEach((meal) => {
          meal.items.forEach((item) => {
            newItems.push({
              day: d.name,
              dayTime: meal.type,
              category: item.category,
              name: item.name,
            });
          });
        });
      }
    });

    setItems(newItems);
  }, [day, todayMenu, menu]);

  return (
    <>
      <Helmet>
        <title> Mess Details | Digimess Dining System </title>
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

            {todayMenu.length === 0 ? (
              <Typography variant="h5" color="textSecondary">
                No menu for today
              </Typography>
            ) : (
              todayMenu.map((item, itemIndex) => (
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
              ))
            )}

            <Button variant="contained" onClick={handleOpen} style={{ marginTop: '1rem' }}>
              Edit Menu
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="lg">
              <DialogTitle>Edit {day}'s Menu</DialogTitle>
              <DialogContent>
                {items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                    <Select
                      autoFocus
                      margin="dense"
                      id={`item-${index}-dayTime`}
                      label="Day Time"
                      fullWidth
                      value={item.dayTime}
                      onChange={(event) => handleItemChange(index, 'dayTime', event)}
                    >
                      <MenuItem value="Breakfast">Breakfast</MenuItem>
                      <MenuItem value="Lunch">Lunch</MenuItem>
                      <MenuItem value="Grace1_Lunch">Grace1_Lunch</MenuItem>
                      <MenuItem value="Grace2_Lunch">Grace2_Lunch</MenuItem>
                      <MenuItem value="Snacks">Snacks</MenuItem>
                      <MenuItem value="Dinner">Dinner</MenuItem>
                      <MenuItem value="Grace1_Dinner">Grace1_Dinner</MenuItem>
                    </Select>

                    <Select
                      autoFocus
                      margin="dense"
                      id={`item-${index}-category`}
                      label="Category"
                      fullWidth
                      value={item.category}
                      onChange={(event) => handleItemChange(index, 'category', event)}
                    >
                      <MenuItem value="Veg">Veg</MenuItem>
                      <MenuItem value="Non Veg">Non Veg</MenuItem>
                    </Select>

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

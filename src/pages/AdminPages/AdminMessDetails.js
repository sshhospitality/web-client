import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// components
import { ProductSort, ProductCard } from '../../sections/@dashboard/products';

// ----------------------------------------------------------------------
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

function getCurrentDay() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay(); // Returns a number (0 for Sunday, 1 for Monday, etc.)
  return daysOfWeek[currentDayIndex];
}
// ----------------------------------------------------------------------

export default function AdminMessDetails() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [day, setday] = useState(getCurrentDay());
  const [isEditable, setIsEditable] = useState(false);
  const [messName, setMessName] = useState('Kumar');
  const [menu, setMenu] = useState([]);
  const [todaymenu, updtmenu] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([{ day: '', dayTime: '', category: '', name: '', price: '', type: '' }]);
  const [messDetails, setMessDetails] = useState({
    g1Name: '',
    g1Number: '',
    g2Name: '',
    g2Number: '',
    k1Name: '',
    k1Number: '',
    k2Name: '',
    k2Number: '',
    s1Name: '',
    s1Number: '',
    s2Name: '',
    s2Number: '',
  });
  const [prevMessDetails, setPrevMessDetails] = useState({});
  const [textColor1, setTextColor1] = useState('#637381');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    if (value === 0) {
      setMessName('Kumar');
    } else if (value === 1) {
      setMessName('Galav');
    } else if (value === 2) {
      setMessName('Shree Sai');
    }
  }, [value]);
  useEffect(() => {
    async function menuList() {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/menu/${messName}`,
          {
            xhrFields: {
              withCredentials: true,
            },
          },
          { withCredentials: true }
        );
        const { data } = response;
        setMenu(data);
        updtmenu([]);
      } catch (error) {
        if (error.response.status === 401) {
          navigate('/login', { replace: true });
        }
        console.log(error);
      }
    }
    menuList();
  }, [messName, navigate]);

  useEffect(() => {
    menu.forEach((d) => {
      if (d.name === day) {
        updtmenu(d.meals);
      }
    });
  }, [day, menu]);

  const handleCancel = () => {
    setMessDetails({ ...prevMessDetails });
    setIsEditable(!isEditable);
  };

  useEffect(() => {
    async function updateMDetails() {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/admin/mess/details/`, { withCredentials: true });
        setMessDetails({
          ...messDetails,
          k1Name: data[0].details[0].Name,
          k1Number: data[0].details[0].Number,
          k2Name: data[0].details[1].Name,
          k2Number: data[0].details[1].Number,
          g1Name: data[1].details[0].Name,
          g1Number: data[1].details[0].Number,
          g2Name: data[1].details[1].Name,
          g2Number: data[1].details[1].Number,
          s1Name: data[2].details[0].Name,
          s1Number: data[2].details[0].Number,
          s2Name: data[2].details[1].Name,
          s2Number: data[2].details[1].Number,
        });
        setPrevMessDetails({
          ...prevMessDetails,
          k1Name: data[0].details[0].Name,
          k1Number: data[0].details[0].Number,
          k2Name: data[0].details[1].Name,
          k2Number: data[0].details[1].Number,
          g1Name: data[1].details[0].Name,
          g1Number: data[1].details[0].Number,
          g2Name: data[1].details[1].Name,
          g2Number: data[1].details[1].Number,
          s1Name: data[2].details[0].Name,
          s1Number: data[2].details[0].Number,
          s2Name: data[2].details[1].Name,
          s2Number: data[2].details[1].Number,
        });
      } catch (error) {
        console.log(error);
      }
    }
    updateMDetails();
  }, [messDetails, prevMessDetails]);

  async function updateMessDetails(Name1, Number1, Name2, Number2) {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/${messName}/update-details`,
        {
          Name1,
          Number1,
          Name2,
          Number2,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  }
  const handleEditDetails = (messName) => {
    if (isEditable) {
      setTextColor1('#000000');
      if (messName === 'Kumar') {
        updateMessDetails(messDetails.k1Name, messDetails.k1Number, messDetails.k2Name, messDetails.k2Number);
      } else if (messName === 'Galav') {
        updateMessDetails(messDetails.g1Name, messDetails.g1Number, messDetails.g2Name, messDetails.g2Number);
      } else if (messName === 'Shree Sai') {
        updateMessDetails(messDetails.s1Name, messDetails.s1Number, messDetails.s2Name, messDetails.s2Number);
      }
      setPrevMessDetails({ ...messDetails });
    } else {
      setTextColor1('#637381');
    }
    setIsEditable(!isEditable);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {
    try {
      let mess = null;
      if (value === 0) {
        mess = 'Kumar';
      } else if (value === 1) {
        mess = 'Galav';
      } else {
        mess = 'Shree Sai';
      }
      await axios.post(
        'http://localhost:5000/api/menu/updateMenu',
        {
          messName: mess,
          menu: items,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log('Error fetching transaction');
      console.log(error);
    }
  };
  const handleAddItem = () => {
    setItems([...items, { day, dayTime: '', category: '', name: '', price: '', type: '' }]);
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
              price: item.price,
              type: item.type,
            });
          });
        });
      }
    });

    setItems(newItems);
  }, [day, value, todaymenu, menu]);

  return (
    <>
      <Helmet>
        <title> Mess Details | IIT Bhilai Dinning System </title>
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
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab style={{ fontSize: '16px' }} label="Kumar" {...a11yProps(0)} />
                <Tab style={{ fontSize: '16px' }} label="Galav" {...a11yProps(1)} />
                <Tab style={{ fontSize: '16px' }} label="Shree Sai" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Typography variant="h3" align="center" mt={2} mb={2}>
                Mess-Committee Details
              </Typography>
              <hr />
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', right: '0' }}>
                  {isEditable && (
                    <Button
                      variant="outlined"
                      style={{
                        margin: '10px 1rem',
                        height: '2rem',
                        minWidth: '70px',
                        color: 'red',
                        borderColor: 'red',
                      }}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant={isEditable ? 'contained' : 'outlined'}
                    style={{ margin: '10px 0rem', height: '2rem', minWidth: '70px' }}
                    onClick={() => {
                      handleEditDetails(messName);
                    }}
                  >
                    {isEditable ? 'Save' : 'Edit'}
                  </Button>
                </div>
              </div>
              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginTop: '50px',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '80%',
                }}
                readOnly={!isEditable}
                value={messDetails.k1Name}
                onChange={(e) => setMessDetails({ ...messDetails, k1Name: e.target.value })}
              />

              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '100%',
                }}
                readOnly={!isEditable}
                value={messDetails.k1Number}
                onChange={(e) => setMessDetails({ ...messDetails, k1Number: e.target.value })}
              />
              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '100%',
                }}
                readOnly={!isEditable}
                value={messDetails.k2Name}
                onChange={(e) => setMessDetails({ ...messDetails, k2Name: e.currentTarget.value })}
              />
              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '100%',
                }}
                readOnly={!isEditable}
                value={messDetails.k2Number}
                onChange={(e) => setMessDetails({ ...messDetails, k2Number: e.currentTarget.value })}
              />
              <hr />
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5rem' }}
              >
                <Typography variant="h2">Menu</Typography>
                <Button
                  variant="contained"
                  style={{ margin: '15px 0rem', height: '2.5rem', minWidth: '80px' }}
                  onClick={handleOpen}
                >
                  Edit Menu
                </Button>
              </div>
              <Stack
                direction="row"
                flexWrap="wrap-reverse"
                alignItems="center"
                justifyContent="flex-end"
                sx={{ mb: 5 }}
              >
                <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                  <ProductSort setDay={setday} />
                </Stack>
              </Stack>

              <Typography variant="h3" style={{ color: '#2b2c30' }}>
                {day}
              </Typography>

              {todaymenu.map((item, itemIndex) => (
                <>
                  <Typography
                    key={itemIndex}
                    variant="h4"
                    my={'20px'}
                    style={{ backgroundColor: '#d0f2ff', padding: '0px 10px', color: '#04297a' }}
                  >
                    {item.type}
                  </Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                    {/* <br/> */}

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
                </>
              ))}
            </CustomTabPanel>
            {/* ------------------------------------------------------------------------------------- */}
            <CustomTabPanel value={value} index={1}>
              <Typography variant="h3" align="center" mt={2} mb={2}>
                Mess-Committee Details
              </Typography>
              <hr />
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', right: '0' }}>
                  {isEditable && (
                    <Button
                      variant="outlined"
                      style={{
                        margin: '10px 1rem',
                        height: '2rem',
                        minWidth: '70px',
                        color: 'red',
                        borderColor: 'red',
                      }}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant={isEditable ? 'contained' : 'outlined'}
                    style={{ margin: '10px 0rem', height: '2rem', minWidth: '70px' }}
                    onClick={() => {
                      handleEditDetails(messName);
                    }}
                  >
                    {isEditable ? 'Save' : 'Edit'}
                  </Button>
                </div>
              </div>
              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginTop: '50px',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '80%',
                }}
                readOnly={!isEditable}
                value={messDetails.g1Name}
                onChange={(e) => setMessDetails({ ...messDetails, g1Name: e.currentTarget.value })}
              />

              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '100%',
                }}
                readOnly={!isEditable}
                value={messDetails.g1Number}
                onChange={(e) => setMessDetails({ ...messDetails, g1Number: e.currentTarget.value })}
              />
              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '100%',
                }}
                readOnly={!isEditable}
                value={messDetails.g2Name}
                onChange={(e) => setMessDetails({ ...messDetails, g2Name: e.currentTarget.value })}
              />
              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '100%',
                }}
                readOnly={!isEditable}
                value={messDetails.g2Number}
                onChange={(e) => setMessDetails({ ...messDetails, g2Number: e.currentTarget.value })}
              />
              <hr />
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5rem' }}
              >
                <Typography variant="h2">Menu</Typography>
                <Button
                  variant="contained"
                  style={{ margin: '15px 0rem', height: '2.5rem', minWidth: '80px' }}
                  onClick={handleOpen}
                >
                  Edit Menu
                </Button>
              </div>

              <Stack
                direction="row"
                flexWrap="wrap-reverse"
                alignItems="center"
                justifyContent="flex-end"
                sx={{ mb: 5 }}
              >
                <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                  <ProductSort setDay={setday} />
                </Stack>
              </Stack>
              <Typography variant="h3" style={{ color: '#2b2c30' }}>
                {day}
              </Typography>
              {todaymenu.map((item) => (
                <>
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
                </>
              ))}
            </CustomTabPanel>
            {/* -------------------------------------------------------------------------------------------- */}

            <CustomTabPanel value={value} index={2}>
              <Typography variant="h3" align="center" mt={2} mb={2}>
                Mess-Committee Details
              </Typography>
              <hr />
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', right: '0' }}>
                  {isEditable && (
                    <Button
                      variant="outlined"
                      style={{
                        margin: '10px 1rem',
                        height: '2rem',
                        minWidth: '70px',
                        color: 'red',
                        borderColor: 'red',
                      }}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant={isEditable ? 'contained' : 'outlined'}
                    style={{ margin: '10px 0rem', height: '2rem', minWidth: '70px' }}
                    onClick={() => {
                      handleEditDetails(messName);
                    }}
                  >
                    {isEditable ? 'Save' : 'Edit'}
                  </Button>
                </div>
              </div>
              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginTop: '50px',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '80%',
                }}
                readOnly={!isEditable}
                value={messDetails.s1Name}
                onChange={(e) => setMessDetails({ ...messDetails, s1Name: e.currentTarget.value })}
              />

              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '100%',
                }}
                readOnly={!isEditable}
                value={messDetails.s1Number}
                onChange={(e) => setMessDetails({ ...messDetails, s1Number: e.currentTarget.value })}
              />

              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '100%',
                }}
                readOnly={!isEditable}
                value={messDetails.s2Name}
                onChange={(e) => setMessDetails({ ...messDetails, s2Name: e.currentTarget.value })}
              />

              <input
                type="text"
                style={{
                  height: '33px',
                  border: isEditable ? '1px solid #000000' : 'none',
                  marginBottom: '20px',
                  color: textColor1,
                  width: '100%',
                }}
                readOnly={!isEditable}
                value={messDetails.s2Number}
                onChange={(e) => setMessDetails({ ...messDetails, s2Number: e.currentTarget.value })}
              />
              <hr />
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5rem' }}
              >
                <Typography variant="h2">Menu</Typography>
                <Button
                  variant="contained"
                  style={{ margin: '15px 0rem', height: '2.5rem', minWidth: '80px' }}
                  onClick={handleOpen}
                >
                  Edit Menu
                </Button>
              </div>
              <Stack
                direction="row"
                flexWrap="wrap-reverse"
                alignItems="center"
                justifyContent="flex-end"
                sx={{ mb: 5 }}
              >
                <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                  <ProductSort setDay={setday} />
                </Stack>
              </Stack>
              <Typography variant="h3" style={{ color: '#2b2c30' }}>
                {day}
              </Typography>
              {todaymenu.map((item) => (
                <>
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
                </>
              ))}
            </CustomTabPanel>
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

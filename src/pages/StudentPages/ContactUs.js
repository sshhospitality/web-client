import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import axios from 'axios';

// @mui
import { Button, Container, Typography, TextField, Box } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Form } from 'semantic-ui-react';
// components
import Swal from 'sweetalert2';

// ----------------------------------------------------------------------

const SERVICE_ID = 'service_3k0ua7g';
const TEMPLATE_ID = 'template_5sw2wi9';
const USER_ID = 'D6DKJjcrvzaH6b4fU';

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
// ----------------------------------------------------------------------

export default function ContactUs() {
  const navigate = useNavigate();

  const id = localStorage.getItem('id');
  const email = localStorage.getItem('email');
  const name = localStorage.getItem('name');
  const [messDetails, setMessDetails] = useState();

  useEffect(() => {
    async function updateMDetails() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/admin/getadmindetails/`, { withCredentials: true });
        const data = response.data;
        console.log(data);
        const vendorRepresentatives = data.filter((item) => item.Position === 'vendor_representative');
        const studentRepresentatives = data.filter((item) => item.Position === 'student_representative');
        setMessDetails({ vendorRepresentatives, studentRepresentatives });
      } catch (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate('/login', { replace: true });
        }
        console.log(error);
      }
    }
    updateMDetails();
  }, [navigate]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target, USER_ID).then(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent Successfully',
        });
      },
      (error) => {
        console.log(error.text);
        Swal.fire({
          icon: 'error',
          title: 'Ooops, something went wrong',
          text: error.text,
        });
      }
    );
    e.target.reset();
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title> Contact Page | Naivedyam Dinning System </title>
      </Helmet>
      <div style={{ display: 'flex' }}>
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
                maxWidth: 600,
                mx: 'auto',

                p: 4,
                borderRadius: '12px',
                boxShadow: 6,
                height: '513px',
              }}
            >
              <Typography variant="h3" align="center" mt={2} mb={2}>
                Mess-Committee Details
              </Typography>

              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Vendor Representative" {...a11yProps(0)} />
                  <Tab label="Student Representative" {...a11yProps(1)} />
                </Tabs>
              </Box>

              <CustomTabPanel value={value} index={0}>
                {messDetails &&
                  messDetails.vendorRepresentatives.map((person) => (
                    <div key={person._id}>
                      <Typography variant="h5" align="left" mt={4} mb={1}>
                        {person.Name}
                      </Typography>
                      <Typography subtitle1="h6" align="left" mb={2}>
                        {person.Number}
                      </Typography>
                    </div>
                  ))}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                {messDetails &&
                  messDetails.studentRepresentatives.map((person) => (
                    <div key={person._id}>
                      <Typography variant="h5" align="left" mt={4} mb={1}>
                        {person.Name}
                      </Typography>
                      <Typography subtitle1="h6" align="left" mb={2}>
                        {person.Number}
                      </Typography>
                    </div>
                  ))}
              </CustomTabPanel>
            </Box>
          </Box>
        </Container>
        <Container>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'auto',
              maxWidth: '450px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: 600,
                mx: 'auto',

                p: 4,
                borderRadius: '12px',
                boxShadow: 6,
              }}
            >
              <Typography variant="h3" align="center" mt={2} mb={2}>
                Contact Us
              </Typography>

              <Form onSubmit={handleOnSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="form-input-control-email"
                  control="input"
                  label="Email"
                  name="user_email"
                  placeholder="Email"
                  required
                  icon="mail"
                  inputProps={{ readOnly: true }}
                  defaultValue={email}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  id="form-input-control-last-name"
                  control="input"
                  label="Name"
                  name="from_name"
                  placeholder="Name"
                  required
                  icon="user circle"
                  inputProps={{ readOnly: true }}
                  defaultValue={name}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="form-input-control-id"
                  control="input"
                  label="Id"
                  name="from_id"
                  placeholder="ID Number"
                  required
                  icon="user circle"
                  inputProps={{ readOnly: true }}
                  defaultValue={id}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  id="form-textarea-control-opinion"
                  control="input"
                  label="Message"
                  name="message"
                  placeholder="Message…"
                  required
                />
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    mt: 2,
                    backgroundColor: '#000',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#111',
                    },
                  }}
                >
                  Submit
                </Button>
              </Form>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
}

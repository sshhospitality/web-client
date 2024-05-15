// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import axios from 'axios';

// @mui
import { Button, Container, Typography, TextField, Box, Rating } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Form } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

// Service details for sending emails
const SERVICE_ID = 'service_3k0ua7g';
const TEMPLATE_ID = 'template_5sw2wi9';
const USER_ID = 'D6DKJjcrvzaH6b4fU';

// Custom Tab Panel component
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

// Function to set accessibility props for tabs
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// Main component for Contact Us page
export default function ContactUs() {
  const navigate = useNavigate();

  // Retrieve user details from local storage
  const userId = localStorage.getItem('id');
  const email = localStorage.getItem('email');
  const name = localStorage.getItem('name');
  // State variables for storing mess details, selected rating, and uploaded image
  const [messDetails, setMessDetails] = useState();
  const [rating, setRating] = useState(0);
  const [selectedFile, setSelectedFile] = useState({myFile:""});

  // Fetch mess details from the server on component mount
  useEffect(() => {
    async function updateMDetails() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/admin/getadmindetails/`, {
          withCredentials: true,
        });
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

  // Function to handle form submission
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      rating,
      email: email,
      name: name,
      userId: userId,
      message: e.target.message.value,
      image: null, // Placeholder for the image data
    };
    if (selectedFile.myFile!=='') {
      /* onst reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        requestData.image = reader.result;
        // Once the file is encoded, make the POST request
        makePostRequest(requestData);
      };
      reader.onerror = (error) => {
        console.error('Error encoding file:', error);
      }; */
      requestData.image = selectedFile.myFile;
      console.log(requestData);
      makePostRequest(requestData);
    } else {
      // If no file is selected, make the POST request without the image
      makePostRequest(requestData);
    }

    /* // Send email using emailjs
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target, USER_ID).then(
      () => {
        // Display success message if email sent successfully
        Swal.fire({
          icon: 'success',
          title: 'Message Sent Successfully',
        });
      },
      (error) => {
        // Display error message if email sending fails
        console.log(error.text);
        Swal.fire({
          icon: 'error',
          title: 'Ooops, something went wrong',
          text: error.text,
        });
      }
    ); */
    // Reset form fields
    e.target.reset();
  };
  const makePostRequest = async (requestData) => {
    const formData = new FormData();
    formData.append("name", requestData.name);
    formData.append("userId", requestData.userId);
    formData.append("email", requestData.email);
    formData.append("message", requestData.message);
    formData.append("rating", requestData.rating);
    if(requestData.image!=null){
      formData.append("image", requestData.image);
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/feedback/feedback_post`, formData, {
        headers: {
          'Content-Type': "multipart/form-data", // Set the content type to JSON
        },
        withCredentials: true,
      });
      console.log('Response:', response.data);
      Swal.fire({
        icon: 'success',
        title: 'Message Sent Successfully',
      });
      // Optionally handle success response here
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Ooops, something went wrong',
        text: error.text,
      });
      // Optionally handle error here
    }
  };
  // Function to handle rating change
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  // Function to handle file selection
/*   const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  }; */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile({ ...selectedFile, myFile: file });
  };

  // State variable for controlling active tab
  const [value, setValue] = React.useState(0);

  // Function to handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title> Contact Page | Digimess Dinning System </title>
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
                  label="College Id"
                  name="userId"
                  placeholder="ID Number"
                  required
                  icon="user circle"
                  inputProps={{ readOnly: true }}
                  defaultValue={userId}
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

                {/* Rating */}
                <Typography variant="subtitle1" mb={1} mt={2}>
                  Rate Your Experience
                </Typography>
                <Rating name="rating" value={rating} onChange={handleRatingChange} size="large" precision={1} />

                {/* Image Upload */}
                <Typography variant="subtitle1" mb={1} mt={2}>
                  Upload Image
                </Typography>
                <input
                  type="file"
                  label="Image"
                  name="myFile"
                  accept=".jpeg, .png, .jpg"
                  onChange={(e) => handleFileChange(e)}
                />
{/*                 <label htmlFor="raised-button-file">
                  <Button variant="outlined" component="span">
                    Choose File
                  </Button>
                </label> */}
                {selectedFile && <Typography>{selectedFile.name}</Typography>}

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


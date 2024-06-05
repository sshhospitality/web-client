import React, { useContext, useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Container, Button, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import axios from 'axios';
import { LoadingContext } from '../../components/LoadingContext';
import { handleCustomAlert } from '../../components/handleCustomAlert';

export default function StudentRegister() {
  const { setIsLoading } = useContext(LoadingContext);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [preference, setPreference] = useState('');

  const handleFile = useCallback((e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const csv = e.target.result;
      const rows = csv.split('\n').slice(1); // skip header

      rows.forEach((row) => {
        const [sNo, name, email, password, userId,year,department,phone, preference] = row.split(',');
        // Perform validation if needed
        // Then send data to backend API for each student
        sendDataToBackend(name, email, password, userId,year,department,phone, preference);
      });
    };
    handleCustomAlert('Registration Successful', '', 'success');
    reader.onerror = () => {
      console.error('Error reading file');
    };

    reader.readAsText(file);
  }, []);
  const sendDataToBackend = useCallback(async (name, email, password, userId,year,department,phone, preference) => {
    // You can use fetch API or any other method to send data to your backend API
    // Example using fetch API:
    if (name === '' || userId === '' || email === '' || password === '' || year === '' || department === '' || phone === '') {
      handleCustomAlert('Empty Field', 'Please fill all the fields', 'danger');
      return;
    }

    if (password.length < 5) {
      handleCustomAlert('Password Length Short', 'Please fill a password of atleast 5 characters', 'danger');
      return;
    }

    // if (window.confirm('Confirm the registration?')) {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/auth/signup`,
        { email, password, userId, name, person: 'Student',year,department,phone, preference },
        { withCredentials: true }
      );
      // if (responce.status === 200) {
      // handleCustomAlert('Registration Successful', '', 'success');
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    // }
  }, []);
  // const [messName, setMessName] = useState('');
  // const [amount, setAmount] = useState('');
  // const [type, setType] = React.useState('');

  // const handleTypeChange = (event) => {
  //   setType(event.target.value);
  // };
  const handleIRegister = async () => {
    if (name === '' || userId === '' || email === '' || password === ''|| year === '' || department === '' || phone === '') {
      handleCustomAlert('Empty Field', 'Please fill all the fields', 'danger');
      return;
    }

    if (password.length < 5) {
      handleCustomAlert('Password Length Short', 'Please fill a password of atleast 5 characters', 'danger');
      return;
    }

    if (window.confirm('Confirm the registration?')) {
      setIsLoading(true);
      try {
        const responce = await axios.post(
          `${process.env.REACT_APP_API}/auth/signup`,
          { email, password, userId, name, person: 'Student' ,year,department,phone, preference},
          { withCredentials: true }
        );
        if (responce.status === 200) {
          handleCustomAlert('Registration Successful', '', 'success');
        }
        setName('');
        setDepartment('');
        setEmail('');
        setPassword('');
        setUserId('');
        setYear('');
        setPhone('');
        setPreference('');
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <Container
        maxWidth="xs"
        style={{ boxShadow: 'grey 0px 0px 5px 0px', borderRadius: '13px', padding: '3rem', margin: 'auto' }}
      >
        <Typography variant="h4" gutterBottom color={'black'} mb={'1rem'} textAlign={'center'}>
          Registration Portal
        </Typography>
        <Grid container spacing={3} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} md={12}>
            <TextField
              required
              id="name"
              label="Name"
              fullWidth
              variant="standard"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              required
              id="userId"
              label="Id Number"
              fullWidth
              variant="standard"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              required
              id="email"
              label="Email ID"
              fullWidth
              variant="standard"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              required
              id="password"
              label="Password"
              fullWidth
              variant="standard"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              required
              id="year"
              label="Year"
              fullWidth
              variant="standard"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              required
              id="department"
              label="Department"
              fullWidth
              variant="standard"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              required
              id="phone"
              label="Phone Number"
              fullWidth
              variant="standard"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl variant="standard" fullWidth>
            <InputLabel id="preference-label">Preference</InputLabel>
            <Select
              labelId="preference-label"
              id="preference"
              value={preference}
              onChange={(event) => setPreference(event.target.value)}
              label="Preference"
            >
              <MenuItem value={"Veg"}>Veg</MenuItem>
              <MenuItem value={"Non-Veg"}>Non-Veg</MenuItem>
            </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12} display={'flex'} justifyContent={'end'}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              style={{ padding: '0.3rem 2rem' }}
              onClick={handleIRegister}
            >
              Register
            </Button>
          </Grid>
        </Grid>
        <Typography variant="h4" gutterBottom color={'black'} mb={'1rem'} textAlign={'center'}>
          Upload CSV File
        </Typography>
        <input type="file" accept=".csv" id="file-input" style={{ marginBottom: '1rem' }} onChange={handleFile} />
        {/* <button onClick={handleFile}>Upload</button> */}
      </Container>
    </div>
  );
}

import React, { useContext, useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Container, Button, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import axios from 'axios';
import { LoadingContext } from '../../components/LoadingContext';
import { handleCustomAlert } from '../../components/handleCustomAlert';
import { set } from 'lodash';

export default function CollegeRegister() {
  const { setIsLoading } = useContext(LoadingContext);
  const [name, setName] = useState('');
  const [cid, setCid] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

    const handleFile = useCallback((e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const csv = e.target.result;
        const rows = csv.split('\n').slice(1); // skip header
  
        rows.forEach(row => {
          const [sNo, name, email, password, cid,address,phone] = row.split(',');
          // Perform validation if needed
          // Then send data to backend API for each student
          sendDataToBackend(name, email, password, cid,address,phone);
        });
        handleCustomAlert('Registration Successful', '', 'success');
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
      };
  
      reader.readAsText(file);
    }, []);
    const sendDataToBackend = useCallback(async (name, email, password, cid,address,phone) => {
      // You can use fetch API or any other method to send data to your backend API
      // Example using fetch API:
      if (
        name === '' ||
        cid === '' ||
        email === '' ||
        password === '' ||
        address === '' ||
        phone === ''
      ) {
        handleCustomAlert('Empty Field', 'Please fill all the fields', 'danger');
        return;
      }
  
      if(password.length<5){
        handleCustomAlert('Password Length Short', 'Please fill a password of atleast 5 characters', 'danger');
        return;
      }
  
      // if (window.confirm('Confirm the registration?')) {
        setIsLoading(true);
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API}/auth/signup`,
            { email, password, name, person: "College",cid,address,phone },
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
    if (
      name === '' ||
      cid === '' ||
      email === '' ||
      password === '' ||
      address === '' ||
      phone === ''
    ) {
      handleCustomAlert('Empty Field', 'Please fill all the fields', 'danger');
      return;
    }

    if(password.length<5){
      handleCustomAlert('Password Length Short', 'Please fill a password of atleast 5 characters', 'danger');
      return;
    }

    if (window.confirm('Confirm the registration?')) {
      setIsLoading(true);
      try {
        const responce = await axios.post(
          `${process.env.REACT_APP_API}/auth/signup`,
          { email, password, cid, name, person: "College",address,phone },
          { withCredentials: true }
        );
        if (responce.status === 200) {
          handleCustomAlert('Registration Successful', '', 'success');
        }
        setName('');
        setCid('');
        setEmail('');
        setPassword('');
        setAddress('');
        setPhone('');
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
        <Grid container spacing={3} sx = {{ marginBottom: 2 }}>
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
              value={cid}
              onChange={(event) => setCid(event.target.value)}
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
              id="phone"
              label="Phone Number"
              fullWidth
              variant="standard"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              required
              id="address"
              label="Address"
              fullWidth
              variant="standard"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
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

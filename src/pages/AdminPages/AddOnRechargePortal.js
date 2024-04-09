import React, { useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Container, Button, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import axios from 'axios';
import { LoadingContext } from '../../components/LoadingContext';
import { handleCustomAlert } from '../../components/handleCustomAlert';

export default function AddOnRechargePortal() {
  const { setIsLoading } = useContext(LoadingContext);
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [messName, setMessName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = React.useState('');

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const handleMessNameChange = (event) => {
    setMessName(event.target.value);
  };
  const handleIndvPayment = async () => {
    if (
      name === '' ||
      amount === '' ||
      type === '' ||
      (type === 'messWise' && messName === '') ||
      (type === 'individual' && idNumber === '')
    ) {
      handleCustomAlert('Empty Field', 'Please fill all the fields', 'danger');
      return;
    }

    if (window.confirm('Confirm the payment?')) {
      setIsLoading(true);
      try {
        const responce = await axios.post(
          'http://localhost:5000/api/admin/addon/recharge/individual',
          { name, idNumber, amount },
          { withCredentials: true }
        );
        if (responce.status === 200) {
          handleCustomAlert('Payment Successful', '', 'success');
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleMessWisePayment = async () => {
    if (
      name === '' ||
      amount === '' ||
      type === '' ||
      (type === 'messWise' && idNumber === '') ||
      (type === 'individual' && messName === '')
    ) {
      handleCustomAlert('Empty Field', 'Please fill all the fields', 'danger');
      return;
    }

    if (window.confirm('Confirm the payment?')) {
      setIsLoading(true);
      try {
        const responce = await axios.post(
          'http://localhost:5000/api/admin/addon/recharge/messWise',
          { name, messName, amount },
          { withCredentials: true }
        );
        if (responce.status === 200) {
          handleCustomAlert('Payment Successful', '', 'success');
        }
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
          Add-On Recharge Portal
        </Typography>{' '}
        <Grid container spacing={3}>
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
            <FormControl variant="standard" sx={{ m: 0, minWidth: '100%' }}>
              <InputLabel id="type">Recharge Type</InputLabel>
              <Select labelId="type" id="type" value={type} onChange={handleTypeChange} label="Type">
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'messWise'}>Mess-Wise</MenuItem>
                <MenuItem value={'individual'}>Individual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {type === 'messWise' && (
            <Grid item xs={12} md={12}>
              <FormControl variant="standard" sx={{ m: 0, minWidth: '100%' }}>
                <InputLabel id="messName">Mess Name</InputLabel>
                <Select
                  labelId="messName"
                  id="messName"
                  value={messName}
                  onChange={handleMessNameChange}
                  label="Mess Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'kumar'}>Kumar</MenuItem>
                  <MenuItem value={'galav'}>Galav</MenuItem>
                  <MenuItem value={'shree-sai'}>Shree Sai</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          {type === 'individual' && (
            <Grid item xs={12} md={12}>
              <TextField
                required
                id="idNumber"
                label="Id number"
                fullWidth
                variant="standard"
                value={idNumber}
                onChange={(event) => setIdNumber(event.target.value)}
              />
            </Grid>
          )}

          <Grid item xs={12} md={12}>
            <TextField
              required
              id="amount"
              label="Amount"
              helperText="Enter the amount you want to pay"
              fullWidth
              variant="standard"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={12} display={'flex'} justifyContent={'end'}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              style={{ padding: '0.3rem 2rem' }}
              onClick={type === 'messWise' ? handleMessWisePayment : handleIndvPayment}
            >
              Recharge
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// @mui
import { Button, Container, Typography, Grid, TextField } from '@mui/material';

export default function VerifyIndiForm() {
  const navigate = useNavigate();
  const [id, setId] = React.useState('');
  const handleRequest = async () => {
    navigate(`/admin/verifyIndividualUser?id=${id}&page=1`);
  };

  const handleInputChange = (event) => {
    setId(event.target.value);
  };

  return (
    <>
      <Helmet>
        <title> Verification Portal| Naivedyam Dinning System </title>
      </Helmet>

      <Container style={{ margin: '20vh auto' }}>
        <Typography margin={'0.5rem'} marginBottom={'2rem'} variant="h2" gutterBottom>
          Enter the Student ID:
        </Typography>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} sm={8}>
            <TextField
              id="outlined-basic"
              fullWidth
              label="Student Id"
              variant="outlined"
              value={id}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" onClick={handleRequest}>
              Verifiy
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

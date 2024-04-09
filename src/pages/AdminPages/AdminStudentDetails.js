import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, Grid } from '@mui/material';
import { AppWidgetSummary } from '../../sections/@dashboard/app';

export default function AdminStudentDetails() {
  const navigate = useNavigate();
  useEffect(() => {
    async function verify() {
      await axios
        .post(
          'http://localhost:5000/api/verify/person',
          {
            xhrFields: {
              withCredentials: true,
            },
          },
          { withCredentials: true }
        )
        .then((res) => {
          const { person } = res.data;
          if (person !== 'Admin') navigate('/login', { replace: true });
        })
        .catch((err) => {
          if (err.response.status === 401) {
            navigate('/login', { replace: true });
          } else console.log(err);
          localStorage.clear();
          sessionStorage.clear();
        });
    }
    verify();
  }, [navigate]);
  return (
    <>
      <Helmet>
        <title> Student Details | IIT Bhilai Dinning System </title>
      </Helmet>

      <Container style={{ margin: '20vh auto' }}>
        <Typography margin={'0.5rem'} marginBottom={'2rem'} variant="h2" gutterBottom>
          Know the Student Details !
        </Typography>
        <Grid container spacing={3}>
          <Grid onClick={() => navigate('/admin/kumarStudents')} item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="" total={'Kumar'} color="info" icon={'ant-design:interaction-twotone'} />
          </Grid>

          <Grid onClick={() => navigate('/admin/galavStudents')} item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="" total={'Galav'} color="warning" icon={'ant-design:interaction-twotone'} />
          </Grid>

          <Grid onClick={() => navigate('/admin/saiStudents')} item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="" total={'Shree Sai'} color="error" icon={'ant-design:interaction-twotone'} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

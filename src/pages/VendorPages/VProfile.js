import React from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from 'mdb-react-ui-kit';

export default function VProfile() {
  const navigate = useNavigate();
  const handleOut = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${process.env.REACT_APP_API}/auth/logout`,
      { xhrFields: { withCredentials: true } },
      { withCredentials: true }
    );
    if (res.status(200)) {
      console.log('logged out');

      localStorage.clear();
      sessionStorage.clear();
      navigate('/login', { replace: true });
    }
  };
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  const cid = localStorage.getItem('cid');
  const phone = localStorage.getItem('phone');
  const address = localStorage.getItem('address');
  return (
    <>
      <Helmet>
        <title> Profile Page | Naivedyam Dinning System </title>
      </Helmet>
      <section style={{ backgroundColor: '' }}>
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody
                  className="text-center"
                  style={{minHeight: '267px',display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <MDBCardImage
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0x0ZiBEwwzWeZs35Rw-xEUcUKT6sy2fFGTC2XbG0_yovNtqJxy8cxEPi6zEKg9QdTFU&usqp=CAU"
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: '150px' }}
                    fluid
                  />
                  <Button variant="contained" onClick={handleOut} sx={{ mt: 3, ml: 1 }}>
                    {' '}
                    LogOut
                  </Button>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <MDBCardBody style={{ minHeight: '267px' }}>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>College Name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{name}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{email}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                   <hr /> 
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>ID</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{cid}</MDBCardText>
                    </MDBCol>
                  </MDBRow> 
                  <hr /> 
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Address</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{address}</MDBCardText>
                    </MDBCol>
                  </MDBRow> 
                  <hr /> 
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Phone Number</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{phone}</MDBCardText>
                    </MDBCol>
                  </MDBRow> 
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </>
  );
}

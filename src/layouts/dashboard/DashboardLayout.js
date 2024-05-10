import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    async function validation() {
      try {
        const res = await axios.post('http://localhost:5000/api/verify/person', { xhrFields: { withCredentials: true } }, { withCredentials: true });        
        if(res.data.person === 'Vendor')
          navigate('/vendor/dashboard', {replace: true});
        else if(res.data.person === 'Admin')
          navigate('/admin/dashboard', {replace: true});
        else if(res.data.person === 'Department')
          navigate('/department/dashboard', {replace: true});
        else if (res.data.person !== 'Student') {
          sessionStorage.clear();
          localStorage.clear();
          navigate('/login', { replace: true });
        }

      }
      catch (error) {
        console.log(error);
        sessionStorage.clear();
        localStorage.clear();
        navigate('/login', { replace: true });
      }
    }
    validation();
  }, [navigate]);
  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />

      <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}

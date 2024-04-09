import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
// import account from '../../../_mock/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Dashboard',
    icon: 'eva:home-fill',
    reDirect:'',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    reDirect:'profile',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const navigate = useNavigate();
  const handleOut = async (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    const res = await axios.post('http://localhost:5000/api/auth/logout', {xhrFields:{withCredentials: true}},{withCredentials: true});
    navigate('/login', { replace: true });
  };
  const handleClose = () => {
    setOpen(null);
  };
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0x0ZiBEwwzWeZs35Rw-xEUcUKT6sy2fFGTC2XbG0_yovNtqJxy8cxEPi6zEKg9QdTFU&usqp=CAU"} alt="photoURL" />
        {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={(e) => {
                e.preventDefault();
                setOpen(null);
                navigate(`../vendor/${option.reDirect}`, { replace: true });
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleOut} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}

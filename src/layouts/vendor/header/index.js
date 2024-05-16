import React, { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
import Swal from 'sweetalert2';
import AccountPopover from './AccountPopover';
import axios from 'axios';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;
const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateNotification = async() => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/notification/create`,
        { title, message},
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent Successfully',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ooops, something went wrong',
        text: error.text,
      });
    }
    setOpen(false);
  };

  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <IconButton
            onClick={handleClickOpen}
            sx={{
              color: 'text.primary',
            }}
          >
            <Iconify icon="eva:plus-fill" />
          </IconButton>
          {/* <LanguagePopover /> */}
          {/* <NotificationsPopover /> */}
          <AccountPopover />
        </Stack>
      </StyledToolbar>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Notification</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="message"
            label="Message"
            type="text"
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateNotification}>Create</Button>
        </DialogActions>
      </Dialog>
    </StyledRoot>
  );
}

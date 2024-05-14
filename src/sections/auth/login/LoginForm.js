import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // const token = localStorage.getItem('jwtToken');
    async function checkLogin() {
      await axios
        .post(
          `${process.env.REACT_APP_API}/verify/person`,
          { xhrFields: { withCredentials: true } },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          const { person } = res.data;
          if (person === 'Student') navigate('/dashboard/app', { replace: true });
          else if (person === 'College') navigate('/vendor/dashboard', { replace: true });
          else if (person === 'Admin') navigate('/admin/dashboard', { replace: true });
          else if (person === 'Department') navigate('/department/dashboard', { replace: true });
        })
        .catch((err) => {
          if (err.response.status === 401) {
            console.log('Unauthorized, Login Again!');
          } else console.log(err);
          localStorage.clear();
          sessionStorage.clear();
        });
    }
    checkLogin();
  }, [navigate]);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (email === '' || password === '') {
      alert('Please fill in all the fields');
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log(`${process.env.REACT_APP_API}`)
      console.log(response.data);
      localStorage.setItem('person', response.data.person);
      localStorage.setItem('email', email);

      if (response.data.person === 'Student') navigate('/dashboard/app', { replace: true });
      else if (response.data.person === 'College') navigate('/vendor/dashboard', { replace: true });
      else if (response.data.person === 'Department') navigate('/department/dashboard', { replace: true });
      else navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      // Handle error response here
      if (error.response.status === 401) {
        console.log('Unauthorized, Login Again!');
      }
      if (error.response && error.response.data && error.response.data.msg) {
        const errorMessage = error.response.data.msg;
        // Display the error message to the user (e.g., using an alert or on the UI)
        alert(errorMessage);
      } else {
        // Handle unexpected errors
        console.error(error);
      }
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" required onChange={(e) => setEmail(e.target.value)} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
        Login
      </LoadingButton>
    </>
  );
}

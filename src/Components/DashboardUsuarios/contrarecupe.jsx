import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, FormControl, InputLabel ,IconButton, OutlinedInput, InputAdornment } from '@mui/material';
import Logo from './logo.png';
import Logo2 from './logo2.PNG';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { NavLink, useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';

const Contrarecupe = () => {
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const navigate = useNavigate();


  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
    validatePassword(event.target.value);
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setNewPasswordError('La contraseña debe tener al menos 8 caracteres.');
    } else if (!/[A-Z]/.test(password)) {
      setNewPasswordError('La contraseña debe contener al menos una letra mayúscula.');
    } else if (!/[0-9]/.test(password)) {
      setNewPasswordError('La contraseña debe contener al menos un número.');
    } else {
      setNewPasswordError('');
    }
  };

  const handleUpdatePassword = async () => {
    const token = new URLSearchParams(location.search).get('token');

    if (!token) {
      setEmailError('Token no proporcionado.');
      return;
    }

    if (newPasswordError) {
      setEmailError(newPasswordError);
      return;
    }

    const passwordData = {
      token,
      newPassword: passwordInput,
    };

    try {
      const response = await axios.put('https://uniback.onrender.com/api/resetPassword', passwordData);
      console.log('Contraseña actualizada:', response.data);
      alert('Contraseña actualizada con éxito.');
      navigate('/login')
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      setEmailError('Error al actualizar la contraseña. Intenta nuevamente más tarde.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Box sx={{ backgroundColor: '#d01c35', padding: '15px', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={Logo2} alt="logo" style={{ width: '40px', height: '40px' }} />
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h4" component="div" sx={{ textAlign: 'left', textDecoration: 'underline', color: 'inherit' }}>
              Uninventory
            </Typography>
          </NavLink>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Paper elevation={3} sx={{ padding: '50px', paddingBottom: '50px', maxWidth: '600px', width: '100%', height: '400px', backdropFilter: 'blur(8px)', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,255)', opacity: 0.9, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
            <img src={Logo} alt='logo' style={{ width: '150px', height: '80px' }} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Typography variant="h6" color="Black">
              Ingrese su nueva contraseña
            </Typography>
          </Box>
          <Box sx={{ marginTop: '30px' }}>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(event) => setPasswordInput(event.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Contraseña"
                    required
                    sx={{ fontSize: '1.2rem', '& .MuiInputBase-input': { fontSize: '1.2rem', padding: '12px' } }}
                  />
                </FormControl>
              </Grid>
                <Grid item xs={12} sx={{ marginTop: '40px' }}>
                <Button fullWidth variant="contained" sx={{ backgroundColor: '#d01c35', fontSize: '1.2rem', padding: '15px' }} onClick={handleUpdatePassword}>
                    Actualizar contraseña
                </Button>
                </Grid>
            </Grid>
            </Box>
        </Paper>
      </Box>

      <Box sx={{ backgroundColor: '#d01c35', padding: '80px', color: 'white', textAlign: 'center' }}>
        <Typography>
          Vicerrectoría Académica
          Dirección de Nuevas Tecnologías y Educación Virtual - DINTEV
        </Typography>
      </Box>
    </Box>
  );
};

export default Contrarecupe;

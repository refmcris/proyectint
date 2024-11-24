import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, FormControl, InputLabel, IconButton, Button, InputAdornment, OutlinedInput, Grid } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, NavLink, useNavigate} from 'react-router-dom';
import Logo from './logo3.PNG'
import Logo1 from './logo1.png'
import { useAuth } from './AuthContext'; 

import axios from 'axios';
import Cookies from 'js-cookie';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email: emailInput,
        password: passwordInput
      });
      setUserInfo(response.data);
      setErrorMessage('');
      
      Cookies.set('id_usuario',response.data.id_usuario);
      Cookies.set('userName', response.data.nombre);
      Cookies.set('userLastName', response.data.apellido);
      Cookies.set('userRole', response.data.rol);
      Cookies.set('imagen',response.data.imagen);
      localStorage.setItem('isAuthenticated', 'true');
      
      const userRole = response.data.rol;
      login(userRole); 
      if (userRole === 'admin') {
        navigate('/admin/home');
      } else if (userRole === 'estudiante') {
        navigate('/usuarios/home');
      } else {
        navigate('/error'); 
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setErrorMessage('Credenciales incorrectas. Verifica tu correo y contraseña.');
            break;
          case 404:
            setErrorMessage('Usuario no encontrado. Verifica tu correo.');
            break;
          case 500:
            setErrorMessage('Error interno del servidor. Intenta más tarde.');
            break;
          default:
            setErrorMessage('Ocurrió un error inesperado. Intenta de nuevo.');
        }
      } else if (error.request) {
        setErrorMessage('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        setErrorMessage('Ocurrió un error inesperado. Intenta de nuevo.');
      }
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
      <Box sx={{ backgroundColor: '#cd1f32', padding: '15px', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h4" component="div" sx={{ textAlign: 'left', textDecoration: 'underline', color: 'inherit',fontFamily: 'Teko, sans-serif',fontWeight: 700}}>
              Uninventory
          </Typography>
          </NavLink>
          
        </Box>
      </Box>

      <Box
        sx={{display: 'flex',flex: 1,justifyContent: 'center',alignItems: 'center',backgroundSize: 'cover',backgroundPosition: 'center'}}

      >
        <Paper elevation={3} sx={{ padding: '50px', paddingBottom: '50px', maxWidth: '600px', width: '100%',height: '400px', borderRadius: '8px' ,backgroundColor: 'rgba(255,255,255,255)', opacity: 0.9, boxShadow:'0px 4px 12px rgba(0, 0, 0, 0.2)'}}>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          {/* <img src={Logo1} alt="logo" style={{ width: '180', height: '100px' }} /> */}
          <Typography variant="h2" component="div" sx={{ textAlign: 'left', textDecoration: 'underline', color: '#d01c34',fontFamily: 'Teko, sans-serif',fontWeight: 700}}>
              Uninventory
          </Typography>
          </Box>
          {errorMessage && (
          <Box 
            sx={{
              color: '#b71c1c',
              padding: 1,
              borderRadius: 1,
              marginBottom: 2,
              textAlign:'center'
            }}
          >
            <Typography variant="body2">{errorMessage}</Typography>
          </Box>
        )}
          <Box sx={{ marginTop: '30px' }}>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  id="Username"
                  label="Correo electrónico"
                  variant="outlined"
                  fullWidth
                  value={emailInput}
                  onChange={(event) => {
                    const email = event.target.value;
                    setEmailInput(email);

                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                      setEmailError('Correo electrónico no válido');
                    } else {
                      setEmailError('');
                    }
                  }}
                  required
                  error={!!emailError} 
                  helperText={emailError} 
                  sx={{ fontSize: '1.2rem', '& .MuiInputBase-input': { fontSize: '1.2rem', padding: '12px' } }} 
                />
              </Grid>

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
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleLogin}
                  sx={{ backgroundColor: '#d01c34', fontSize: '1.2rem', padding: '15px' }}
                >
                  Iniciar sesión
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center">
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" sx={{ cursor: 'pointer', color: 'primary', fontWeight: 'bold' }}>
                Si no estás registrado, haz clic aquí para registrarte.
              </Typography>
            </Link>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ backgroundColor: '#cd1f32', padding: '80px', color: 'white', textAlign: 'center' }}>
        <Typography>
        Vicerrectoría Académica
        Dirección de Nuevas Tecnologías y Educación Virtual - DINTEV
        </Typography>
        
      </Box>
    </Box>
  );
};

export default Login;

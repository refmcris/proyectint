import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, FormControl, InputLabel, IconButton, Button, InputAdornment, OutlinedInput, Grid } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from './logo.png'
import Logo2 from './logo2.PNG';
import { Link, NavLink, useNavigate} from 'react-router-dom';
import axios from 'axios';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

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
      alert('Inicio de sesión exitoso');
      navigate('/admin/home');
    } catch (error) {
      if (error.response) {
        console.error('Error al iniciar sesión:', error.response.data.message);
      } else if (error.request) {
        console.error('Error en la solicitud:', error.request);
      } else {
        console.error('Error en la configuración de la solicitud:', error.message);
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
        sx={{display: 'flex',flex: 1,justifyContent: 'center',alignItems: 'center',backgroundSize: 'cover',backgroundPosition: 'center'}}

      >
        <Paper elevation={3} sx={{ padding: '50px', paddingBottom: '50px', maxWidth: '600px', width: '100%',height: '400px', backdropFilter: 'blur(8px)',borderRadius: '8px' ,backgroundColor: 'rgba(255,255,255,255)', opacity: 0.9, boxShadow:'0px 4px 12px rgba(0, 0, 0, 0.2)'}}>
          <Box sx={{display:'flex',justifyContent:'center',marginBottom:'5px'}}>
            <img src= {Logo} alt='logo'style={{ width: '150px', height: '80px' }}/>
          </Box>

      
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Typography variant="h6" color="primary">
              
            </Typography>
          </Box>
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
                  sx={{ backgroundColor: '#d01c35', fontSize: '1.2rem', padding: '15px' }}
                >
                  Iniciar sesión
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" sx={{ cursor: 'pointer', color: 'primary', fontWeight: 'bold' }}>
                Si no estás registrado, haz clic aquí para registrarte.
              </Typography>
            </Link>
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

export default Login;

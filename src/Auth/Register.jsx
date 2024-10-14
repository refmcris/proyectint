import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Logo from './logo3.PNG';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [correoinput, setCorreoinput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [lastnameInput, setLastnameInput] = useState('');
  const [documentInput, setDocumentInput] = useState('');
  const [documentTypeInput, setDocumentTypeInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleDocumentTypeChange = (event) => {
    setDocumentTypeInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    
    const data = {
      correo: correoinput,
      name: nameInput,
      lastname: lastnameInput,
      document: documentInput,
      documentType: documentTypeInput,
      phone: phoneInput,
      password: passwordInput,
      rol : 'Estudiante',
      
    };

    try {
      await axios.post('http://localhost:3001/api/register', data);
      console.log(data);
      alert("Registro exitoso");
    } catch (error) {
      console.error('Error al registrar:', error.message);
      alert("Error al registrar el usuario");
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
      <Box sx={{ backgroundColor: '#d01c35', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={Logo} alt="logo" style={{ width: '40px', height: '40px' }} />
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h4" component="div" sx={{ textAlign: 'left', textDecoration: 'underline', color: 'inherit' }}>
              Uninventory
            </Typography>
          </NavLink>
        </Box>
      </Box>

      <Box
        sx={{display: 'flex',flex: 1,justifyContent: 'center',alignItems: 'center',backgroundSize: 'cover',backgroundPosition: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{padding: '60px',maxWidth: '900px',width: '100%',backdropFilter: 'blur(8px)',borderRadius: '12px',backgroundColor: 'rgba(255, 255, 255, 0.9)',boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
                <TextField id="name" label="Nombre" value={nameInput} onChange={(event) => setNameInput(event.target.value)} variant="outlined" fullWidth size="large" sx={{ marginBottom: '24px', fontSize: '1.2rem' }} required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="lastname"
                  label="Apellido"
                  value={lastnameInput}
                  onChange={(event) => setLastnameInput(event.target.value)}
                  variant="outlined"
                  fullWidth
                  size="large"
                  sx={{ marginBottom: '24px', fontSize: '1.2rem' }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl sx={{ width: '100%', marginBottom: '24px', fontSize: '1.2rem' }} variant="outlined">
                  <InputLabel id="document-type-label" sx={{ fontSize: '1.2rem' }}>Tipo de Documento</InputLabel>
                  <Select
                    labelId="document-type-label"
                    id="document-type"
                    value={documentTypeInput}
                    onChange={handleDocumentTypeChange}
                    label="Tipo de Documento"
                    size="large"
                    required
                    sx={{ fontSize: '1.2rem' }}
                  >
                    <MenuItem value="T.I">TI</MenuItem>
                    <MenuItem value="C.C">CC</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  id="document"
                  label="Documento"
                  value={documentInput}
                  onChange={(event) => setDocumentInput(event.target.value)}
                  variant="outlined"
                  fullWidth
                  size="large"
                  sx={{ marginBottom: '24px', fontSize: '1.2rem' }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField id="correoelectronico" label="Correo Electronico" value={correoinput} onChange={(event) => setCorreoinput(event.target.value)} variant="outlined" fullWidth size="large" sx={{ marginBottom: '24px', fontSize: '1.2rem' }}required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="phone"
                  label="Teléfono"
                  value={phoneInput}
                  onChange={(event) => setPhoneInput(event.target.value)}
                  variant="outlined"
                  fullWidth
                  size="large"
                  sx={{ marginBottom: '24px', fontSize: '1.2rem' }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="password"
                  label="Contraseña"
                  value={passwordInput}
                  onChange={(event) => setPasswordInput(event.target.value)}
                  variant="outlined"
                  fullWidth
                  size="large"
                  type={showPassword ? 'text' : 'password'}
                  sx={{ marginBottom: '24px', fontSize: '1.2rem' }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField id="password-confirm" label="Confirmar contraseña" value={passwordInput} onChange={(event) => setPasswordInput(event.target.value)} variant="outlined" fullWidth size="large" type={showPassword ? 'text' : 'password'} sx={{ marginBottom: '24px', fontSize: '1.2rem' }} required
                />
              </Grid>
              <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<LoginIcon />}
                    sx={{
                        padding: { xs: '12px', sm: '14px', md: '16px' }, 
                        fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, 
                        width: { xs: '80%', sm: '60%', md: '40%' },  
                        backgroundColor: '#d01c35',
                        '&:hover': {
                            backgroundColor: '#b71b2d',  
                        }
                    }}
                >
                    Registrarse
                </Button>
            </Box>
              </Grid>
            </Grid>
          </form>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Typography variant="caption" sx={{ cursor: 'pointer', color: 'primary', fontWeight: 'bold' }}>
              Si ya estás registrado, haz clic aquí para iniciar sesión.
            </Typography>
          </Link>
        </Paper>
      </Box>

      <Box sx={{ backgroundColor: '#d01c35', padding: '15px', color: 'white', textAlign: 'center' }}>
        <Typography variant="body1">
          © 2024 Uninventory. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;

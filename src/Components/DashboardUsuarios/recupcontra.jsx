import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid } from '@mui/material';
import Logo from './logo.png';
import Logo2 from './logo2.PNG';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Recupcontra = () => {
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    const email = event.target.value;
    setEmailInput(email);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Correo electrónico no válido');
    } else {
      setEmailError('');
    }
  };

  const handleCreateMessage = async () => {
    if (emailError || !emailInput) {
      setEmailError('Por favor, introduce un correo electrónico válido.');
      return;
    }
  
    try {
      const checkResponse = await axios.post('http://localhost:3001/api/checkEmail', { email: emailInput });
      if (checkResponse.status === 200) {
        const { token } = checkResponse.data;
        
        
        
        const emailData = {
            to: emailInput,
            subject: "Recuperación de Contraseña",
            token,
        };

        const response = await axios.post('http://localhost:3001/api/sendEmail', emailData);
        console.log('Correo enviado:', response.data);
        alert("Recibira un correo pronto, revise su bandeja de entrada");
        navigate('/');
        setEmailInput('');
    }
} catch (error) {
    if (error.response && error.response.status === 404) {
        setEmailError('Correo electrónico no encontrado.');
        
    } else {
        console.error('Error al enviar el mensaje:', error);
        setEmailError('Error al enviar el mensaje. Intenta nuevamente más tarde.');
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
              Recuperar contraseña, Ingrese su correo.
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
                  onChange={handleEmailChange}
                  required
                  error={!!emailError}
                  helperText={emailError}
                  sx={{ fontSize: '1.2rem', '& .MuiInputBase-input': { fontSize: '1.2rem', padding: '12px' } }}
                />
              </Grid>

              <Grid item xs={12} sx={{ marginTop: '40px' }}>
                <Button fullWidth variant="contained" sx={{ backgroundColor: '#d01c35', fontSize: '1.2rem', padding: '15px' }} onClick={handleCreateMessage}>
                  Enviar mensaje
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

export default Recupcontra;

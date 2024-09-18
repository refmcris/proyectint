import React, { useState } from 'react';
import { Box, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate, NavLink } from 'react-router-dom';
import Logo from './logo2.PNG'; 
import '@fontsource-variable/open-sans'
import Cookies from 'js-cookie';
const Navbar = () => {

  
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const userName = Cookies.get('userName') || '';
  const userLastName = Cookies.get('userLastName') || '';

  const firstLetterName = userName.charAt(0).toUpperCase();
  const firstLetterLastName = userLastName.charAt(0).toUpperCase();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    
    Cookies.remove('userName');
    Cookies.remove('userLastName');
    Cookies.remove('userRole');
    handleMenuClose();
    navigate('/');
  };

  return (
    <Box sx={{ backgroundColor: '#d01c34', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',position:'fixed',top:'0',width:'calc(100% - 20px)',zIndex:1000}}>
      <Box sx={{ display: 'flex', alignItems: 'center',gap:'20px' }}>
        <img src={Logo} alt="logo" style={{ width: '40px', height: '40px' }} />
        <NavLink to="/usuarios/home" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h4" component="div" sx={{ textAlign: 'left', textDecoration: 'underline', color: 'inherit' }}>
            Uninventory
          </Typography>
        </NavLink>
        <NavLink to="/usuarios/home" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'none', fontSize: '15px',fontFamily: 'Open Sans Variable'}}>
           Pagina Principal
          </Typography>
        </NavLink>
        <NavLink to="/area-prestamos" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'none', fontSize: '15px',fontFamily: 'Open Sans Variable'}}>
            Área Préstamos
          </Typography>
        </NavLink>
        <NavLink to="/mis-prestamos" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'none', fontSize: '15px',fontFamily: 'Open Sans Variable' }}>
            Mis Préstamos
          </Typography>
        </NavLink>
      </Box>

      
      <Box>
        <Avatar
          sx={{ cursor: 'pointer', backgroundColor: 'white', color: '#d01c35' }}
          onClick={handleMenuOpen}
        >
          {firstLetterName}{firstLetterLastName}
        </Avatar>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)}onClose={handleMenuClose} >
          <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;

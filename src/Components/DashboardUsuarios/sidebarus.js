import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Popover, IconButton, Button, Badge } from '@mui/material';
import { useNavigate, NavLink } from 'react-router-dom';
import Logo from './logo2.PNG'; 
import '@fontsource-variable/open-sans'
import Cookies from 'js-cookie';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import axios from 'axios';
import { useUserContext } from './UserContext';
import { useAuth } from '../../Auth/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const { userData } = useUserContext();
  const { logout } = useAuth();

  const profileImage = userData?.imagen || '';

  const userId = Cookies.get('id_usuario');
  const userimg = Cookies.get('imagen');


  

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
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/notificaciones/${userId}`);
        setNotifications(response.data);
        
      } catch (error) {
        console.error('Error al obtener notificaciones:', error.message);
        if (error.response) {
          console.error('Detalles de la respuesta:', error.response.data);
        }
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  return (
    <Box sx={{ backgroundColor: '#d01c34', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',position:'fixed',top:'0',width:'calc(100% - 20px)',zIndex:1000}}>
      <Box sx={{ display: 'flex', alignItems: 'center',gap:'20px' }}>
        <img src={Logo} alt="logo" style={{ width: '40px', height: '40px' }} />
        <NavLink to="/usuarios/home" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h4" component="div" sx={{ textAlign: 'left', textDecoration: 'underline', color: 'inherit', fontFamily: 'Teko, sans-serif',fontWeight: 700  }}>
            Uninventory
          </Typography>
        </NavLink>
        <NavLink to="/usuarios/home" style={({ isActive }) =>({ textDecoration: 'none',color: isActive ? '#f56c6c' : '#FFFFFF',borderBottom: isActive ? '2px solid #f56c6c' : 'none',borderColor:'#ffff',
            paddingBottom: '5px', color: 'inherit' })}>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'none', fontSize: '15px',fontFamily: 'Open Sans Variable'}}>
            Pagina Principal
          </Typography>
        </NavLink>
        <NavLink to="/area-prestamos" style={({ isActive }) =>({ textDecoration: 'none',color: isActive ? '#f56c6c' : '#FFFFFF',borderBottom: isActive ? '2px solid #f56c6c' : 'none',borderColor:'#ffff',
            paddingBottom: '5px', color: 'inherit' })}>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'none', fontSize: '15px',fontFamily: 'Open Sans Variable'}}>
            Área Préstamos
          </Typography>
        </NavLink>
        <NavLink to="/mis-prestamos" style={({ isActive }) =>({ textDecoration: 'none',color: isActive ? '#f56c6c' : '#FFFFFF',borderBottom: isActive ? '2px solid #f56c6c' : 'none',borderColor:'#ffff',
            paddingBottom: '5px', color: 'inherit' })}>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'none', fontSize: '15px',fontFamily: 'Open Sans Variable' }}>
            Mis Préstamos
          </Typography>
        </NavLink>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Badge badgeContent={1} color="error" invisible={notifications.length === 0} sx={{marginRight:3}}>
          <IconButton sx={{ color: 'white' }} onClick={handleNotificationOpen}>
            <NotificationsOutlinedIcon />
          </IconButton>
        </Badge>

        <Popover
          open={Boolean(notificationAnchorEl)}
          anchorEl={notificationAnchorEl}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              width: '400px',
              padding: '10px',
              borderRadius: '8px',
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: '10px',
              borderBottom: '2px solid #d01c34',
              paddingBottom: '10px',
            }}
          >
            Notificaciones
          </Typography>
          {notifications.length > 0 ? (
            notifications.slice(0, 3).map((notification) => (
              <Typography key={notification.id_notificacion} variant="body1" sx={{ marginBottom: '10px' }}>
                {notification.mensaje}
              </Typography>
            ))
          ) : (
            <Typography variant="body1">No tienes notificaciones</Typography>
          )}
          <Button onClick={() => navigate('/profile')} sx={{ width: '100%', marginTop: '10px', textAlign: 'center', color: '#d01c34' }}>
            Ver todo
          </Button>
        </Popover>


        <Avatar
          sx={{ cursor: 'pointer', backgroundColor: 'white', color: '#d01c35' }}
          src={profileImage || userimg}
          onClick={handleMenuOpen}
        >
        </Avatar>
        <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{ width: '800',mt: 1.5, }}
      >
        <Button
          onClick={() => navigate('/profile')}
          sx={{
            justifyContent:'left',
            padding: '10px',
            width: '100%',
            textTransform: 'none', 
            color: '#000', 
            '&:hover': {
              color: '#fffff',
              backgroundColor:'#f56c6c' 
            },
          }}
        >
          Perfil
        </Button>
        <Button
          onClick={handleLogout}
          sx={{
            justifyContent:'left',
            padding: '10px',
            width: '100%',
            textTransform: 'none', 
            color: '#000', 
            '&:hover': {
              color: '#fffff',
              backgroundColor:'#f56c6c' 
            },
          }}
        >
          Cerrar sesión
        </Button> 
     </Popover>
      </Box>
    </Box>
  );
};

export default Navbar;

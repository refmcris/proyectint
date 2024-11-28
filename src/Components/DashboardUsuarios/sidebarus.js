import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Popover, IconButton, Button, Badge, Drawer } from '@mui/material';
import { useNavigate, NavLink } from 'react-router-dom';
import '@fontsource-variable/open-sans';
import Cookies from 'js-cookie';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useUserContext } from './UserContext';
import { useAuth } from '../../Auth/AuthContext';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Nuevo estado para el sidebar
  const navigate = useNavigate();
  const { notifications, setNotifications, userData, resetUserData } = useUserContext();
  const { logout } = useAuth();

  const userimg = Cookies.get('imagen');
  const profileImage = userData?.imagen || userimg;

  const userId = Cookies.get('id_usuario');

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
    Cookies.remove('imagen');
    resetUserData();  
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

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen); // Alterna el estado del sidebar
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/notificaciones/${userId}`);
        setNotifications(response.data); 
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId, setNotifications]);

  return (
    <Box sx={{ backgroundColor: '#cd1f32', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', top: '0', width: '100%', zIndex: 1000 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <NavLink to="/usuarios/home" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h4" component="div" sx={{ textAlign: 'left', textDecoration: 'underline', color: 'inherit', fontFamily: 'Teko, sans-serif', fontWeight: 700 }}>
            Uninventory
          </Typography>
        </NavLink>

        {/* Icono de hamburguesa para pantallas pequeñas */}
        <IconButton sx={{ display: { xs: 'block', md: 'none' }, color: 'white' }} onClick={handleSidebarToggle}>
          <MenuIcon />
        </IconButton>

        {/* Navegación para pantallas grandes */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '20px' }}>
          <NavLink to="/usuarios/home" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#f56c6c' : '#FFFFFF',
            borderBottom: isActive ? '2px solid #f56c6c' : 'none',
            paddingBottom: '5px',
            color: 'inherit',
          })}>
            <Typography sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'none', fontSize: '15px', fontFamily: 'Open Sans Variable' }}>
              Página Principal
            </Typography>
          </NavLink>

          <NavLink to="/area-prestamos" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#f56c6c' : '#FFFFFF',
            borderBottom: isActive ? '2px solid #f56c6c' : 'none',
            paddingBottom: '5px',
            color: 'inherit',
          })}>
            <Typography sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'none', fontSize: '15px', fontFamily: 'Open Sans Variable' }}>
              Área Préstamos
            </Typography>
          </NavLink>

          <NavLink to="/mis-prestamos" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#f56c6c' : '#FFFFFF',
            borderBottom: isActive ? '2px solid #f56c6c' : 'none',
            paddingBottom: '5px',
            color: 'inherit',
          })}>
            <Typography sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'none', fontSize: '15px', fontFamily: 'Open Sans Variable' }}>
              Mis Préstamos
            </Typography>
          </NavLink>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Badge badgeContent={1} color="error" invisible={notifications.length === 0} sx={{ marginRight: 3 }}>
          <IconButton sx={{ color: 'white' }} onClick={handleNotificationOpen} aria-label="Notificaciones">
            <NotificationsOutlinedIcon />
          </IconButton>
        </Badge>

        <Popover
          open={Boolean(notificationAnchorEl)}
          anchorEl={notificationAnchorEl}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { width: '400px', padding: '10px', borderRadius: '8px' } }}
        >
          <Typography variant="h6" sx={{ marginBottom: '10px', borderBottom: '2px solid #d01c34', paddingBottom: '10px' }}>
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
          sx={{ cursor: 'pointer', backgroundColor: 'white', color: '#C20E1A', mr:5 }}
          src={profileImage}
          onClick={handleMenuOpen}
          aria-label="Notificaciones"
          title="Notificaciones"
        />

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{ width: '800', mt: 1.5 }}
        >
          <Button
            onClick={() => navigate('/profile')}
            sx={{
              justifyContent: 'left',
              padding: '10px',
              width: '100%',
              textTransform: 'none',
              color: '#000',
              '&:hover': { color: '#fffff', backgroundColor: '#f56c6c' },
            }}
          >
            Perfil
          </Button>
          <Button
            onClick={handleLogout}
            sx={{
              justifyContent: 'left',
              padding: '10px',
              width: '100%',
              textTransform: 'none',
              color: '#000',
              '&:hover': { color: '#fffff', backgroundColor: '#f56c6c' },
            }}
          >
            Cerrar sesión
          </Button>
        </Popover>
      </Box>
      {/* Sidebar - Drawer para pantallas pequeñas */}
      <Drawer
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '240px',
            backgroundColor: '#fffff',
            color: 'white',
          },
        }}
        anchor="left"
        open={isSidebarOpen}
        onClose={handleSidebarToggle}
      >
         <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleSidebarToggle} sx={{ color: '#495057' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ padding: '20px' }}>
          <NavLink to="/usuarios/home" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#f56c6c' : '#FFFFFF',
            borderBottom: isActive ? '2px solid #f56c6c' : 'none',
            paddingBottom: '5px',
            color: 'inherit',
          })}>
            <Typography sx={{ color: '#495057', fontWeight: 'bold', fontSize: '15px', fontFamily: 'Open Sans Variable' }}>
              Página Principal
            </Typography>
          </NavLink>
          <NavLink to="/area-prestamos" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#f56c6c' : '#FFFFFF',
            borderBottom: isActive ? '2px solid #f56c6c' : 'none',
            paddingBottom: '5px',
            color: 'inherit',
          })}>
            <Typography sx={{ color: '#495057', fontWeight: 'bold', fontSize: '15px', fontFamily: 'Open Sans Variable' }}>
              Área Préstamos
            </Typography>
          </NavLink>
          <NavLink to="/mis-prestamos" style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#f56c6c' : '#FFFFFF',
            borderBottom: isActive ? '2px solid #f56c6c' : 'none',
            paddingBottom: '5px',
            color: 'inherit',
          })}>
            <Typography sx={{ color: '#495057', fontWeight: 'bold', fontSize: '15px', fontFamily: 'Open Sans Variable' }}>
              Mis Préstamos
            </Typography>
          </NavLink>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;

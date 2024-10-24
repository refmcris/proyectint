import React, { useState, useEffect } from 'react';
import Navbar from './sidebarus';
import { useUserContext } from './UserContext';
import { Avatar, Box, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, TextField, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import ClearIcon from '@mui/icons-material/Clear';
function Perfiluser() {
  const id_usuario = Cookies.get('id_usuario') || '';
  const [openDialog, setOpenDialog] = useState(false);
  const { userData, setUserData } = useUserContext();
  const [newEmail, setNewEmail] = useState(userData?.correo_electronico || '');
  const [newImage, setNewImage] = useState(userData?.imagen || '');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); 
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };
  const handleClickOpenDelete = (id) => {
    setSelectedNotificationId(id); 
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedNotificationId(null); 
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/notificaciones/${selectedNotificationId}`);
  
      if (response.status === 200) {
        const updatedNotifications = notifications.filter(notification => notification.id !== selectedNotificationId);
        setNotifications(updatedNotifications);
        toast.success("Notificación borrada con éxito",{autoClose:2000}); 
        handleCloseDelete(); 
      }
    } catch (error) {
      console.error('Error al eliminar la notificación:', error);
      toast.error('No se pudo eliminar la notificación. Inténtalo de nuevo más tarde.'); 
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const MAX_SIZE = 5 * 1024 * 1024;

    if (file && file.size > MAX_SIZE) {
      alert("El archivo es demasiado grande. El límite es de 5MB.");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (file && !allowedTypes.includes(file.type)) {
      alert("Por favor, sube un archivo de imagen (JPG, PNG, GIF).");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Uninventorys");

    setLoading(true); 

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/ds6fxjeak/image/upload`, formData);
      const imageUrl = response.data.secure_url;
      setNewImage(imageUrl); 
    } catch (error) {
      console.error("Error al subir la imagen a Cloudinary:", error);
    } finally {
      setLoading(false); 
    }
  };
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/notificaciones/${id_usuario}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  fetchNotifications();

  const handleUpdate = async () => {
    try {
      const updatedUserData = {
        id_usuario: userData.id_usuario,
        nombre: userData.nombre, 
        apellido: userData.apellido, 
        tipo_documento: userData.tipo_documento, 
        documento: userData.documento, 
        correo_electronico: newEmail, 
        telefono: userData.telefono, 
        imagen: newImage || userData.imagen, 
        rol: userData.rol, 
      };

      await axios.put(`http://localhost:3001/api/usuarios/${id_usuario}`, updatedUserData);
      setUserData(prev => ({ ...prev, ...updatedUserData }));
      handleClose();
      toast.success("Perfil actualizado con éxito!",{autoClose:2000});
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/usuarios');
        const user = response.data.find((u) => u.id_usuario == id_usuario);

        if (user) {
          setUserData(user);
          setNewEmail(user.correo_electronico);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id_usuario]);


  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          marginTop: '150px',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '50px',
            paddingBottom: '50px',
            maxWidth: '1300px',
            width: '100%',
            height: '500px',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,255)',
            opacity: 0.9,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        >
          {userData ? (
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                width:'400px',
               
              }}
            >
              <Avatar
                src={userData.imagen || ''} 
                sx={{
                  width: 150,
                  height: 150,
                  fontSize: 40,
                  backgroundColor: 'black',
                  cursor: 'pointer',
                  color: '#d01c35',
                }}
              />
              <Typography variant="h6" gutterBottom   sx={{ fontSize: '2.5rem' }}>
                {userData.nombre || 'Nombre no disponible'} {userData.apellido || 'Apellido no disponible'}
              </Typography>
              <Button fullWidth variant="contained" onClick={handleClickOpen} sx={{ backgroundColor: '#d01c34', fontSize: '1rem', padding: '5px', textTransform:'none'}}
                > Editar Perfil</Button>
              <Typography variant="body1" gutterBottom sx={{ fontSize: '1.5rem' }}>
                <strong>Información Personal</strong>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                <strong>Correo electrónico:</strong>{' '}
                {userData.correo_electronico || 'Correo no disponible'}
              </Typography>
              <Typography variant="body2"sx={{ fontSize: '1rem' }}>
                <strong>País:</strong> Colombia
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                <strong>Sede:</strong> Buga
              </Typography>
            </Card>
          ) : (
            <Typography>Cargando datos del usuario...</Typography>
          )}
           
           <Card
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',  padding: '20px', width: '700px',  
              marginLeft: 4,  top: '150px',   overflowY: 'auto', borderRadius: '10px',  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h3" gutterBottom>
              Notificaciones
            </Typography>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <Box
                  key={notification.id}
                  sx={{
                    padding: '10px',
                    position: 'relative',
                    '&:hover': {
                      '& .delete-button': {
                        display: 'block', 
                      },
                    },
                  }}
                >
                  <Typography variant="h6">{notification.mensaje}</Typography>
                  <IconButton
                    onClick={() => handleClickOpenDelete(notification.id_notificacion)}
                    className="delete-button" 
                    sx={{
                      position: 'absolute',
                      right: 0,
                      bottom: '20px', 
                      display: 'none', 
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                  <Box sx={{  position: 'absolute', bottom: 0, left: '10%', right: '10%', eight: '1px', backgroundColor: '#e0e0e0',  }} />
                </Box>
              ))
            ) : (
              <Typography variant="body2">No tienes notificaciones.</Typography>
            )}
             <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
              <DialogTitle sx={{textAlign:'center'}}>Confirmar Eliminación</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  ¿Estás seguro de que deseas eliminar esta notificación? Esta acción no se puede deshacer.
                </DialogContentText>
              </DialogContent>
              <DialogActions sx ={{justifyContent:'center'}}>
                <Button onClick={handleCloseDelete} sx={{ color: '#f56c6c', borderColor: '#f56c6c', '&:hover': { borderColor: '#f56c6c', backgroundColor: '#fbe8e8' },marginRight:2 }}variant="outlined">
                  Cancelar
                </Button>
                <Button onClick={handleDelete} variant="contained" sx={{ backgroundColor: "#d01c35" }}>
                  Eliminar
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Paper>
        
      </Box>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle sx={{textAlign:'center'}}>Editar Perfil</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Correo electrónico"
            type="email"
            fullWidth
            variant="outlined"
            value={newEmail}
            onChange={handleEmailChange}
          />
          <input
          accept="image/*"
          type="file"
          onChange={handleFileChange}
        />
        {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
        </DialogContent>
        <DialogActions sx={{justifyContent:'center'}}>
          <Button onClick={handleClose} sx={{ color: '#f56c6c', borderColor: '#f56c6c', '&:hover': { borderColor: '#f56c6c', backgroundColor: '#fbe8e8' }}} variant='outlined'>Cancelar</Button>
          <Button type ='submit' onClick={handleUpdate} sx={{ backgroundColor: "#d01c35",color: "white" }}>Guardar</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
      
    </>
  );
}

export default Perfiluser;

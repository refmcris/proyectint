import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Button, Link, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';  
import Item from "./Item";
import slider from "../Helper/slider.json";

function Example() {
    return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            <Box sx={{ backgroundColor: '#cd1f32', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',position:'fixed',top:'0',width:'calc(100% - 20px)',zIndex:1000}}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="h4" component="div" sx={{ textAlign: 'left', textDecoration: 'underline', color: 'inherit',fontFamily: 'Teko, sans-serif',fontWeight: 700 }}>
                        Uninventory
                    </Typography>
                    </NavLink>
                    
                </Box>
                <NavLink to="/login" style={{ textDecoration: 'none' }}>
                    <Typography sx={{ color: 'white', fontWeight: 'bold', textTransform: 'none', fontSize: '20px' }}>
                        Entrar
                    </Typography>
                </NavLink>
            </Box>

            <Box sx={{ marginBottom: '30px',marginTop: '60px'}}>
                <Carousel
                    autoPlay={true}
                    animation="slide"
                    indicators={false}
                    navButtonsAlwaysVisible={true}
                    sx={{
                        width: '100%',
                        border:'5px',
                        height: { xs: '200px', sm: '300px', md: '400px', lg: '700px' }, 
                        '& .MuiPaper-root': {
                            borderRadius: '12px', 
                        },
                        img: {
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', 
                        },
                    }}
                >
                    {slider.map((item) => (
                        <Item key={item.id} item={item} />
                    ))}
                </Carousel>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' }, gap: '20px', maxWidth: '1600px', margin: '0 auto', padding: '10px', marginBottom: '80px' }}>
                <Box sx={{ flex: 1, backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'justify' }}>
                    <Typography variant="h5" sx={{ marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                        Bienvenido a Uninventory
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '18px', marginBottom: '15px' }}>
                        Bienvenido al Sistema Web para el Control de Inventario y Préstamo de Equipos del Laboratorio de Electrónica Industrial. Este proyecto ha sido desarrollado con el objetivo de optimizar la gestión de equipos y componentes en el laboratorio, facilitando tanto el registro como el control de los mismos por parte de estudiantes y docentes.
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '18px' }}>
                        Nuestra plataforma permite llevar un control detallado del inventario, registrar el préstamo de equipos, monitorear su estado, y generar reportes personalizados que ayudan a la toma de decisiones y la planificación de mantenimientos. Los usuarios con roles específicos, como administradores, podrán gestionar las altas y bajas de equipos, mientras que otros roles podrán tener acceso según sus permisos.
                    </Typography>
                </Box>
                <Box 
                    sx={{
                        flex: 1,
                        backgroundColor: 'white',
                        padding: '40px',  
                        borderRadius: '12px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h5" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
                        Ayudas rápidas
                    </Typography>
                    <Box sx={{ textAlign: 'left', paddingLeft: '30px' }}>
                        <Link href="/recupcontra" underline="hover" sx={{ display: 'block', marginBottom: '15px', fontSize: '18px' }}>
                            + Recuperar contraseña
                        </Link>
                        <Link href="#" underline="hover" sx={{ display: 'block', marginBottom: '15px', fontSize: '18px' }}>
                            + 
                        </Link>
                        <Link href="#" underline="hover" sx={{ display: 'block', marginBottom: '15px', fontSize: '18px' }}>
                            + 
                        </Link>
                        <Link href="#" underline="hover" sx={{ display: 'block', marginBottom: '15px', fontSize: '18px' }}>
                            + 
                        </Link>
                        <Link href="#" underline="hover" sx={{ display: 'block', marginBottom: '15px', fontSize: '18px' }}>
                            + 
                        </Link>
                    </Box>
                </Box>



            </Box>

            <Box sx={{ backgroundColor: '#cd1f32', padding: '80px', color: 'white', textAlign: 'center' }}>
            </Box>
        </Box>
    );
}

export default Example;
